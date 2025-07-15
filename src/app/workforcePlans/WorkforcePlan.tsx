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
import { Key, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useSession } from "next-auth/react";
import { getSunday } from "@/lib/utils";
import { submitWorkforcePlan } from "../actions/workforcePlansActions";
import { CompanyContext } from "@/components/CompanyContext";
import { CompanyAccount, Project, Role, WorkforcePlan } from "@prisma/client";
import { ProjectContext } from "@/components/ProjectContext";
import WorkforceWeek from "./WorkforceWeek";
import { emptyRole } from "@/lib/schemas/defaultModels";
import { CompanyWithRoles } from "@/lib/types";

type Dates = {
  dateEnd: Date;
  weekdays: Day[];
}[];

type Day = {
  date: Date;
  dayCount?: number;
  nightCount?: number;
};

function buildDates(workforcePlans: any) {
  const existing = [...workforcePlans].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  existing.sort((a, b) => a.date.getTime() - b.date.getTime());
  const builtDates = [];

  while (existing.length > 0) {
    let i = 0;
    let weekdays = [];
    while (i < 6) {
      i++;
      weekdays.push(existing.shift());
    }
    const sunday = new Date(weekdays[5].date);
    sunday.setDate(sunday.getDate() + 1);
    builtDates.push({
      dateEnd: sunday,
      weekdays: weekdays,
    });
  }
  builtDates.pop();
  return builtDates;
}

function getNewDates() {
  const sunday = getSunday();
  let sundays = [sunday];
  for (var i = 0; i < 10; i++) {
    let lastSunday = sundays[i];
    sundays = [
      ...sundays,
      new Date(lastSunday.setDate(lastSunday.getDate() + 7)),
    ];
  }

  sundays.pop();

  const newDates = sundays.map((sunday) => {
    let weekdays = [] as any;
    for (i = 6; i >= 1; i--) {
      const newDate = new Date(sunday);
      weekdays = [
        ...weekdays,
        {
          date: new Date(newDate.setDate(newDate.getDate() - i)),
          dayCount: null,
          nightCount: null,
        },
      ];
    }
    return {
      dateEnd: sunday,
      weekdays: weekdays,
    };
  });

  return newDates;
}

export default function WorkforcePlanPage({
  workforcePlans,
  company,
}: {
  workforcePlans: WorkforcePlan[];
  company: CompanyWithRoles;
}) {
  const selectedCompany = useContext<CompanyAccount>(CompanyContext);
  const project = useContext<Project>(ProjectContext);
  const { data } = useSession();
  const user = data?.user;
  const roles = company.roles;

  const initialRole = roles.length > 0 ? roles[0] : emptyRole;
  const dates =
    workforcePlans.length > 0 ? buildDates(workforcePlans) : getNewDates();

  const [fillAllDay, setFillAllDay] = useState(0);
  const [fillAllNight, setFillAllNight] = useState(0);
  const [fillWeekDay, setFillWeekDay] = useState<number[]>([]);
  const [fillWeekNight, setFillWeekNight] = useState<number[]>([]);
  const [workForceDates, setWorkforceDates] = useState<Dates>(dates);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);

  useEffect(() => {
    const filteredDates = workforcePlans
      .filter((p) => p.roleId === selectedRole.id)
      .filter((p) => p.projectId === project.id);
    const newDates =
      filteredDates.length > 0 ? buildDates(filteredDates) : getNewDates();
    setWorkforceDates(newDates);
  }, [selectedRole, project]);

  const onSubmit = async () => {
    const data = new FormData();
    data.set("workforcePlan", JSON.stringify(workForceDates));
    data.set("project", JSON.stringify(project));
    data.set("company", JSON.stringify(company));
    data.set("role", JSON.stringify(selectedRole));

    const uploadRequest = await fetch("/api/workforcePlans", {
      method: "POST",
      body: data,
    });
  };

  const onClickFillAll = () => {
    const newDates = workForceDates.map((weeks) => {
      return {
        ...weeks,
        weekdays: weeks.weekdays.map((day: Day) => ({
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
        weekdays: weeks.weekdays.map((day: Day) => ({
          ...day,
          dayCount: day.dayCount ? day.dayCount : fillAllDay,
          nightCount: day.nightCount ? day.nightCount : fillAllNight,
        })),
      };
    });
    setWorkforceDates(newDates);
  };

  const onChangeRole = (key: Key) => {
    const newRole = roles.find((r) => r.id == key);
    if (newRole) {
      setSelectedRole(newRole);
    }
  };

  const onChangeFillAllDay = (value: number) => {
    setFillAllDay(value);
  };

  const onChangeFillAllNight = (value: number) => {
    setFillAllNight(value);
  };

  const onChangeFillWeekDay = (value: number, i: number) => {
    let newWeek = [...fillWeekDay] as any;
    newWeek[i] = value;
    setFillWeekDay(newWeek);
  };

  const onChangeFillWeekNight = (value: number, i: number) => {
    let newWeek = [...fillWeekNight] as any;
    newWeek[i] = value;
    setFillWeekNight(newWeek);
  };

  const handleDayChange = (
    value: number,
    weekIndex: number,
    dayIndex: number
  ) => {
    let newWorkforceDates = [...workForceDates];
    newWorkforceDates[weekIndex].weekdays[dayIndex].dayCount = value;
    setWorkforceDates(newWorkforceDates);
  };

  const handleNightChange = (
    value: number,
    weekIndex: number,
    dayIndex: number
  ) => {
    let newWorkforceDates = [...workForceDates];
    newWorkforceDates[weekIndex].weekdays[dayIndex].nightCount = value;
    setWorkforceDates(newWorkforceDates);
  };

  const onClickFillWeek = (weekIndex: number) => {
    let newDates = [...workForceDates];
    const newWeek = workForceDates[weekIndex].weekdays.map((day: Day) => ({
      ...day,
      dayCount: fillWeekDay[weekIndex] ? fillWeekDay[weekIndex] : day.dayCount,
      nightCount: fillWeekNight[weekIndex]
        ? fillWeekNight[weekIndex]
        : day.nightCount,
    }));

    newDates[weekIndex] = { ...newDates[weekIndex], weekdays: newWeek };
    setWorkforceDates(newDates);
  };

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
              <div>
                {" "}
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" color="primary">
                      {selectedRole.name ? selectedRole.name : "Select a Role"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="primary"
                    variant="faded"
                    aria-label="Static Actions"
                    onAction={(key: Key) => onChangeRole(key)}
                    selectionMode="single"
                  >
                    {roles.map((roles) => (
                      <DropdownItem key={roles.id}>{roles.name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex flex-row">
                <div className="mt-2 mr-2 ">
                  <NumberInput
                    hideStepper
                    label="Day"
                    variant="bordered"
                    onValueChange={(value) => onChangeFillAllDay(value)}
                    value={fillAllDay}
                  />
                </div>
                <div className="mt-2 mr-2 ">
                  <NumberInput
                    hideStepper
                    label="Night"
                    variant="bordered"
                    onValueChange={(value) => onChangeFillAllNight(value)}
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
            {workForceDates.map((week, weekIndex) => {
              return (
                <WorkforceWeek
                  week={week}
                  weekIndex={weekIndex}
                  fillWeekDay={fillWeekDay}
                  fillWeekNight={fillWeekNight}
                  onChangeFillWeekDay={onChangeFillWeekDay}
                  onChangeFillWeekNight={onChangeFillWeekNight}
                  onClickFillWeek={onClickFillWeek}
                  handleDayChange={handleDayChange}
                  handleNightChange={handleNightChange}
                />
              );
            })}
          </div>
          <div className="mt-2">
            <Button color="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
