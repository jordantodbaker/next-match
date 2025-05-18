"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Button, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SafetySchema, safetySchema } from "@/lib/schemas/safetySchema";
import { submitNarrative } from "../actions/safetyActions";

export default function SafetyPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SafetySchema>({
    resolver: zodResolver(safetySchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: SafetySchema) => {
    const result = await submitNarrative(data);
    if (result.status === "success") {
      console.log("word");
    } else {
      console.log(result.error);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Safety Narrative</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Textarea
              {...register("narrative")}
              className="w-full mt-16 h-full"
              label="Narrative"
              placeholder="Enter your Safety Narrative"
            />
          </div>
          <div className="mt-8">
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
