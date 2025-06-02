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
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SafetySchema, safetySchema } from "@/lib/schemas/safetySchema";

type FormValues = {
  cart: { name: string; amount: number }[];
};

import { useSession } from "next-auth/react";
export default function CostsPage() {
  const { data } = useSession();
  const user = data?.user;

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

  const onSubmit = (data: FormValues) => {
    console.log("Submitting", data);
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
            {fields.map((field, index) => {
              return (
                <section key={field.id}>
                  <label>
                    <span>Name</span>
                    <input
                      {...(register(`cart.${index}.name`), { required: true })}
                    />
                  </label>
                  <label>
                    <span>Amount</span>
                    <input
                      type="number"
                      {...register(`cart.${index}.amount`)}
                    />
                  </label>
                  <button type="button" onClick={() => remove(index)}>
                    Delete
                  </button>
                </section>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              append({ name: "bill", amount: 1 });
            }}
          >
            Append
          </button>
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
