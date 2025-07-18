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

type Props = {
  week: any;
  weekIndex: number;
  fillWeekDay: number[];
  fillWeekNight: number[];
  onChangeFillWeekDay: (value: number, i: number) => void;
  onChangeFillWeekNight: (value: number, i: number) => void;
  onClickFillWeek: (weekIndex: number) => void;
  handleDayChange: (value: number, weekIndex: number, dayIndex: number) => void;
  handleNightChange: (
    value: number,
    weekIndex: number,
    dayIndex: number
  ) => void;
};

export default function WorkforceWeek({
  week,
  weekIndex,
  fillWeekDay,
  fillWeekNight,
  onChangeFillWeekDay,
  onChangeFillWeekNight,
  onClickFillWeek,
  handleDayChange,
  handleNightChange,
}: Props) {
  let i = 0;
  return (
    <section key={weekIndex}>
      <div className="flex flex-row justify-center">
        <div className="flex flex-row mt-10">
          {/* <div className="flex flex-col">
            <div className="mt-2 mr-2 w-24">
              <NumberInput
                hideStepper
                label="Hrs"
                variant="bordered"
                onValueChange={(value) => onChangeFillWeekDay(value, weekIndex)}
                value={fillWeekDay[weekIndex]}
              />
            </div>
            <div className="mt-2 mr-2 w-24">
              <NumberInput
                hideStepper
                label="$"
                variant="bordered"
                onValueChange={(value) =>
                  onChangeFillWeekNight(value, weekIndex)
                }
                value={fillWeekNight[weekIndex]}
              />
            </div>
          </div> */}
          <div className="flex flex-col">
            <div className="mt-2 mr-2 w-24 step-two">
              <NumberInput
                hideStepper
                label="Day"
                variant="bordered"
                onValueChange={(value) => onChangeFillWeekDay(value, weekIndex)}
                value={fillWeekDay[weekIndex]}
              />
            </div>
            <div className="mt-2 mr-2 w-24">
              <NumberInput
                hideStepper
                label="Night"
                variant="bordered"
                onValueChange={(value) =>
                  onChangeFillWeekNight(value, weekIndex)
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
        {week.weekdays.map((weekday: any, dayIndex: number) => {
          i++;
          return (
            <div className="mr-4 sm:mt-4 mt-16" key={i}>
              <div className="flex flex-col">
                <span className="text-center">
                  {weekday.date.toLocaleDateString()}
                </span>
                <div className="mt-2 mr-2 w-24">
                  <NumberInput
                    hideStepper
                    label="Day"
                    variant="bordered"
                    key={i}
                    value={weekday.dayCount}
                    onValueChange={(value) =>
                      handleDayChange(value, weekIndex, dayIndex)
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
                    onValueChange={(value) =>
                      handleNightChange(value, weekIndex, dayIndex)
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex flex-col mt-4">
          <span className="text-center">
            {week.dateEnd.toLocaleDateString()}
          </span>
          <div className="mt-2 mr-2 w-24">
            <NumberInput
              hideStepper
              label="Day"
              variant="bordered"
              key={i}
              isDisabled
            />
          </div>
          <div className="mt-2 mr-2 w-24">
            <NumberInput
              hideStepper
              label="Night"
              variant="bordered"
              key={i}
              isDisabled
            />
          </div>
        </div>
      </div>
    </section>
  );
}
