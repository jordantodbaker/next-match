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

  const dates = getDates();

  const [fillAllDay, setFillAllDay] = useState(0);
  const [fillAllNight, setFillAllNight] = useState(0);
  const [fillWeekDay, setFillWeekDay] = useState([]);
  const [fillWeekNight, setFillWeekNight] = useState([]);
  const [workForceDates, setWorkforceDates] = useState(dates);

  // const {
  //   register,
  //   control,
  //   setValue,
  //   handleSubmit,
  //   watch,
  //   formState: { isValid, isSubmitting },
  // } = useForm({
  //   //resolver: zodResolver(safetySchema),
  //   //mode: "onTouched",
  //   defaultValues: {
  //     workforcePlan: dates,
  //   },
  // });

  const onSubmit = async () => {
    console.log("Submitting", workForceDates);
  };

  const onClickFillAll = () => {
    const newDates = workForceDates.map((weeks) => {
      return {
        ...weeks,
        weekdays: weeks.weekdays.map((day: any) => ({
          ...day,
          dayCount: fillAllDay,
          nightCount: fillAllNight,
        })),
      };
    });
    setWorkforceDates(newDates);
  };

  const onClickFillEmpty = () => {
    const newDates = workForceDates.map((weeks) => {
      return {
        ...weeks,
        weekdays: weeks.weekdays.map((day: any) => ({
          ...day,
          dayCount: fillAllDay,
          nightCount: fillAllNight,
        })),
      };
    });
    setWorkforceDates(newDates);
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

  const handleDayChange = (e: any, weekIndex: number, dayIndex: number) => {
    let newWorkforceDates = workForceDates;
    newWorkforceDates[weekIndex].weekdays[dayIndex].dayCount = e.target.value;
    setWorkforceDates(newWorkforceDates);
  };

  const handleNightChange = (e: any, weekIndex: number, dayIndex: number) => {
    let newWorkforceDates = workForceDates;
    newWorkforceDates[weekIndex].weekdays[dayIndex].nightCount = e.target.value;
    setWorkforceDates(newWorkforceDates);
  };

  const onClickFillWeek = (weekIndex: any) => {
    let newDates = [...workForceDates];
    const newWeek = workForceDates[weekIndex].weekdays.map((day: any) => ({
      ...day,
      dayCount: fillWeekDay[weekIndex] ? fillWeekDay[weekIndex] : day.dayCount,
      nightCount: fillWeekNight[weekIndex]
        ? fillWeekNight[weekIndex]
        : day.nightCount,
    }));

    newDates[weekIndex] = { ...newDates[weekIndex], weekdays: newWeek };
    setWorkforceDates(newDates);
  };

  let i = 0;

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Workforce Plan</h1>
        </div>

        <form onSubmit={async () => await onSubmit()}>
          <div className="w-full mt-16 h-full">
            <div className="w-1/4 m-auto mb-4">
              <div className="flex flex-row">
                <div className="mt-2 mr-2 ">
                  <NumberInput
                    hideStepper
                    label="Day"
                    variant="bordered"
                    onChange={(e) => onChangeFillAllDay(e)}
                    value={fillAllDay}
                  />
                </div>
                <div className="mt-2 mr-2 ">
                  <NumberInput
                    hideStepper
                    label="Night"
                    variant="bordered"
                    onChange={(e) => onChangeFillAllNight(e)}
                    value={fillAllNight}
                  />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <Button
                  fullWidth
                  color="primary"
                  onPress={onClickFillAll}
                  className="mr-2"
                >
                  Fill All
                </Button>
                <Button fullWidth color="primary" onPress={onClickFillEmpty}>
                  Fill Empty
                </Button>
              </div>
            </div>
            {workForceDates.map((field, weekIndex) => {
              return (
                <section key={weekIndex}>
                  <div className="flex flex-row justify-center">
                    <div className="flex flex-row mt-4">
                      <div className="flex flex-col">
                        <div>{field.dateEnd}</div>
                        <div className="mt-2 mr-2 w-24">
                          <NumberInput
                            hideStepper
                            label="Day"
                            variant="bordered"
                            onChange={(e) => onChangeFillWeekDay(e, weekIndex)}
                            value={fillWeekDay[weekIndex]}
                          />
                        </div>
                        <div className="mt-2 mr-2 w-24">
                          <NumberInput
                            hideStepper
                            label="Night"
                            variant="bordered"
                            onChange={(e) =>
                              onChangeFillWeekNight(e, weekIndex)
                            }
                            value={fillWeekNight[weekIndex]}
                          />
                        </div>
                      </div>
                      <div className="flex items-center ml-4 mr-4">
                        <Button
                          color="primary"
                          onPress={() => {
                            onClickFillWeek(weekIndex);
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
                              <NumberInput
                                hideStepper
                                label="Day"
                                variant="bordered"
                                key={i}
                                value={weekday.dayCount}
                                onChange={(e) =>
                                  handleDayChange(e, weekIndex, dayIndex)
                                }
                              />
                            </div>
                            <div className="mt-2 mr-2 w-24">
                              <NumberInput
                                hideStepper
                                label="Night"
                                variant="bordered"
                                key={i}
                                value={weekday.nightCount}
                                onChange={(e) =>
                                  handleNightChange(e, weekIndex, dayIndex)
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
            <Button color="primary" onPress={async () => await onSubmit()}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
