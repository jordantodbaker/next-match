"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  NumberInput,
} from "@heroui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useSession } from "next-auth/react";
import { getSunday } from "@/lib/utils";

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

export default function WorkforcePlanPage() {
  const { data } = useSession();
  const user = data?.user;

  const [fillAllDay, setFillAllDay] = useState(0);
  const [fillAllNight, setFillAllNight] = useState(0);
  const [fillWeekDay, setFillWeekDay] = useState([]);
  const [fillWeekNight, setFillWeekNight] = useState([]);

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

  const { fields, append, remove, update, replace } = useFieldArray({
    name: "workforcePlan",
    control,
  });

  const watchFieldArray = watch("workforcePlan");
  const controlledFields = fields.map((field, index) => {
    return { ...field, ...watchFieldArray[index] };
  });

  const onSubmit = async (data: any) => {
    console.log("Submitting", data);
  };

  const onClickFillAll = () => {
    const newDates = dates.map((weeks) => {
      return {
        ...weeks,
        weekdays: weeks.weekdays.map((day: any) => ({
          ...day,
          dayCount: fillAllDay,
          nightCount: fillAllNight,
        })),
      };
    });
    replace(newDates);
  };

  const onChangeFillAllDay = (e: any) => {
    setFillAllDay(parseInt(e.target.value));
  };

  const onChangeFillAllNight = (e: any) => {
    setFillAllNight(parseInt(e.target.value));
  };

  const onChangeFillWeekDay = (e: any, i: number) => {
    let newWeek = fillWeekDay as any;
    newWeek[i] = parseInt(e.target.value);
    setFillWeekDay(newWeek);
  };

  const onChangeFillWeekNight = (e: any, i: number) => {
    let newWeek = fillWeekNight as any;
    newWeek[i] = parseInt(e.target.value);
    setFillWeekNight(newWeek);
  };

  const handleDayChange = (e: any, id: any) => {
    //field.weekdays[dayIndex].dayCount = parseInt(e.target.value);
    setValue(id, e.target.value);
  };

  const handleNightChange = (e: any, id: any) => {
    //field.weekdays[dayIndex].dayCount = parseInt(e.target.value);
    setValue(id, e.target.value);
  };

  const onClickFillWeek = (field: any, index: any) => {
    console.log("FILL WEEK FIELD", field);
    console.log("DAY @ INDEX", fillWeekNight[i]);
    const newWeek = field.weekdays.map((day: any) => ({
      ...day,
      dayCount: fillWeekDay[index] ? fillWeekDay[index] : day.dayCount,
      nightCount: fillWeekNight[index] ? fillWeekNight[index] : day.nightCount,
    }));
    update(index, { ...field, weekdays: newWeek });
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
          onSubmit={handleSubmit(async (data) => await onSubmit(data as any))}
        >
          <div className="w-full mt-16 h-full">
            <div className="w-1/4 m-auto mb-4">
              <div className="flex flex-row">
                <div className="mt-2 mr-2 ">
                  <NumberInput
                    label="Day"
                    variant="bordered"
                    onChange={(e) => onChangeFillAllDay(e)}
                    value={fillAllDay}
                  />
                </div>
                <div className="mt-2 mr-2 ">
                  <NumberInput
                    label="Night"
                    variant="bordered"
                    onChange={(e) => onChangeFillAllNight(e)}
                    value={fillAllNight}
                  />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <Button fullWidth color="primary" onPress={onClickFillAll}>
                  Fill All
                </Button>
              </div>
            </div>
            {fields.map((field, index) => {
              return (
                <section key={field.id}>
                  <div className="flex flex-row justify-center">
                    <div className="flex flex-row mt-4">
                      <div className="flex flex-col">
                        <div>{field.dateEnd}</div>
                        <div className="mt-2 mr-2 w-24">
                          <NumberInput
                            label="Day"
                            variant="bordered"
                            onChange={(e) => onChangeFillWeekDay(e, index)}
                            value={fillWeekDay[index]}
                          />
                        </div>
                        <div className="mt-2 mr-2 w-24">
                          <NumberInput
                            label="Night"
                            variant="bordered"
                            onChange={(e) => onChangeFillWeekNight(e, index)}
                            value={fillWeekNight[index]}
                          />
                        </div>
                      </div>
                      <div className="flex items-center ml-4 mr-4">
                        <Button
                          color="primary"
                          onPress={() => {
                            onClickFillWeek(field, index);
                          }}
                        >
                          Fill Week
                        </Button>
                      </div>
                    </div>
                    {field.weekdays.map((weekday: any, dayIndex: number) => {
                      i++;
                      return (
                        <div className="mr-4 sm:mt-4 mt-16">
                          <div className="flex flex-col">
                            <span>{weekday.date.toLocaleDateString()}</span>
                            <div className="mt-2 mr-2 w-24">
                              <Input
                                {...register(`workforcePlan.${i}.weekdays.day`)}
                                label="Day"
                                variant="bordered"
                                key={field.id}
                                value={weekday.dayCount}
                                onChange={(e) =>
                                  handleDayChange(
                                    e,
                                    `workforcePlan.${i}.weekdays.day`
                                  )
                                }
                              />
                            </div>
                            <div className="mt-2 mr-2 w-24">
                              <Input
                                {...register(
                                  `workforcePlan.${i}.weekdays.night`
                                )}
                                label="Night"
                                variant="bordered"
                                key={field.id}
                                value={weekday.nightCount}
                                onChange={(e) =>
                                  handleNightChange(
                                    e,
                                    `workforcePlan.${i}.weekdays.night`
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
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
