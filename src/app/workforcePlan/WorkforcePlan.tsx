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

type FormValues = {
  headcount: {
    role: { id: number; name: string } | undefined;
    headcount: number;
  }[];
};

type Dates = {
  endDate: {
    date: Date;
    dayCount?: number;
    nightCount?: number;
  };
}[];

function getDates() {
  const sunday = getSunday();
  let sundays = [sunday];
  for (var i = 0; i < 10; i++) {
    let lastSunday = sundays[i];
    sundays = [
      ...sundays,
      new Date(lastSunday.setDate(lastSunday.getDate() + 7)),
    ];
  }
  return sundays.map((sunday) => {
    let weekdays = [] as any;
    for (i = 1; i <= 6; i++) {
      const newDate = new Date(sunday);
      weekdays = [
        ...weekdays,
        {
          day: i,
          date: new Date(newDate.setDate(newDate.getDate() + i)),
          dayCount: null,
          nightCount: null,
        },
      ];
    }
    return {
      dateEnd: sunday.toLocaleDateString(),
      weekdays: weekdays,
    };
  });
}

import { useSession } from "next-auth/react";
import { getSunday } from "@/lib/utils";

export default function WorkforcePlanPage() {
  const { data } = useSession();
  const user = data?.user;

  const dates = getDates();

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
      workforcePlan: dates,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "workforcePlan",
    control,
  });

  const watchFieldArray = watch("workforcePlan");
  const controlledFields = fields.map((field, index) => {
    return { ...field, ...watchFieldArray[index] };
  });

  const onSubmit = (data: FormValues) => {
    console.log("Submitting", data);
  };

  let i = 0;

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Workforce Plan</h1>
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            console.log("DATA", data);
          })}
        >
          <div className="w-full mt-16 h-full">
            <div className="flex sm:flex-row flex-col">
              <div>
                {dates.map((s) => (
                  <p>{s.dateEnd}</p>
                ))}
              </div>
              {fields.map((field, index) => {
                return (
                  <section key={field.id}>
                    {field.weekdays.map((weekday: any) => {
                      console.log("I: ", i);
                      i++;
                      return (
                        <div className="mr-4 sm:mt-4 mt-16">
                          <div className="flex flex-col">
                            <span>{weekday.date.toLocaleDateString()}</span>
                            Day: <Input />
                            Night: <Input />
                          </div>
                        </div>
                      );
                    })}
                  </section>
                );
              })}
            </div>
          </div>
          <Button
            variant="bordered"
            color="primary"
            type="button"
            onClick={() => {
              append({
                role: { id: 0, name: "Select a Role" },
                headcount: 0,
              });
            }}
          >
            Add Another
          </Button>
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
