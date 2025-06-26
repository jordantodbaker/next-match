"use client";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
} from "@heroui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import React from "react";
import { SafetySchema } from "@/lib/schemas/safetySchema";
//import { authorizeNarrative, submitNarrative } from "../../actions/safetyActions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CompanyContext } from "@/components/CompanyContext";
import { CompanyAccount, NarrativeType } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { IconSquareX } from "@tabler/icons-react";
import {
  saveNarrativeType,
  deleteNarrativeType,
} from "@/app/actions/narrativeTypeActions";
import { deleteCompany } from "@/app/actions/companyActions";
import CompanyTable from "./CompanyTable";

type Props = {
  companies: CompanyAccount[];
};

export default function Companies({ companies: retarde }: Props) {
  const { data } = useSession();
  const user = data?.user;
  const [companies, setCompanies] = useState(retarde);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm({
    //resolver: zodResolver(safetySchema),
    //mode: "onTouched",
    defaultValues: {
      companies: companies,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "companies",
    control,
  });

  const onSubmit = async (values: { companies: CompanyAccount[] }) => {
    const result = await Promise.all(
      values.companies.map(async (n) => saveCompany(n))
    );
    const success = result.filter((r) => r.status === "error").length === 0;

    if (success) {
      toast.success("Narrative saved.");
    } else {
      toast.error("Something went wrong.");
    }
  };

  const onDelete = async (index: number) => {
    const result = await deleteCompany(companies[index]);

    if (result.status === "success") {
      const newTypes = companies.filter(
        (t) => t.name !== companies[index].name
      );
      setCompanies(newTypes);
      remove(index);
      toast.success("Narrative saved.");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Companies</h1>
        </div>
        <CompanyTable />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-16 h-full">
            {fields.map((company: CompanyAccount, index: number) => {
              return (
                <div className="mt-2 flex flex-row justify-between">
                  <div className="mr-4">
                    <Input
                      key={company.id}
                      {...register(`companies.${index}.name`)}
                    />
                  </div>
                  <div>
                    <Button
                      color="primary"
                      onPress={async () => {
                        await onDelete(index);
                      }}
                      endContent={<IconSquareX />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <Button
              className="mr-4"
              variant="bordered"
              color="primary"
              type="button"
              onPress={onOpen}
            >
              Add Company
            </Button>
            {/* <Button color="primary" type="submit" isLoading={isSubmitting}>
              Submit
            </Button> */}
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Modal Title
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nullam pulvinar risus non risus hendrerit venenatis.
                      Pellentesque sit amet hendrerit risus, sed porttitor quam.
                    </p>
                    <p>
                      Magna exercitation reprehenderit magna aute tempor
                      cupidatat consequat elit dolor adipisicing. Mollit dolor
                      eiusmod sunt ex incididunt cillum quis. Velit duis sit
                      officia eiusmod Lorem aliqua enim laboris do dolor
                      eiusmod. Et mollit incididunt nisi consectetur esse
                      laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                      deserunt nostrud ad veniam.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </form>
      </div>
    </div>
  );
}
function saveCompany(n: {
  name: string;
  id: number;
  companyCode: string;
}): any {
  throw new Error("Function not implemented.");
}
