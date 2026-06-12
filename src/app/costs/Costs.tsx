"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@heroui/react";
import { useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SafetySchema, safetySchema } from "@/lib/schemas/safetySchema";
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import readXlsxFile from "read-excel-file";

type FormValues = {
  cart: { name: string; amount: number }[];
};

import { useCurrentUser } from "@/lib/useCurrentUser";
import { uploadFile } from "../actions/fileUploadActions";
export default function CostsPage() {
  const data = { user: useCurrentUser() };
  const user = data?.user;
  const [file, setFile] = useState();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm({
    //resolver: zodResolver(safetySchema),
    //mode: "onTouched",
    defaultValues: {
      cart: [{ name: "", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control,
  });

  const onSubmit = async () => {
    await uploadFile(file);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Costs</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-16 h-full">
            <input
              ref={fileInputRef}
              type="file"
              onChange={async (e) => {
                const file = e.target.files?.[0] as File;
                const data = new FormData();
                data.set("file", file);

                readXlsxFile(file).then((rows) => console.log("ROWS ", rows));

                const uploadRequest = await fetch("/api/files", {
                  method: "POST",
                  body: data,
                });
              }}
            />
            <button
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              Upload File
            </button>
          </div>
          <div className="mt-2">
            <Button
              color="primary"
              type="submit"
              isDisabled={!isValid}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
