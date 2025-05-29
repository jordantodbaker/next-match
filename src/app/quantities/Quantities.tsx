"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SafetySchema, safetySchema } from "@/lib/schemas/safetySchema";
//import { authorizeQuantity, submitQuantity } from "../actions/quantityActions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const roles = [
  { id: 1, name: "Boilermaker" },
  { id: 2, name: "Civil" },
  { id: 3, name: "Electirician" },
  { id: 4, name: "Instrument" },
  { id: 5, name: "Insulation" },
  { id: 6, name: "Ironworker" },
  { id: 7, name: "Laborer" },
  { id: 8, name: "Mason" },
  { id: 9, name: "Millwright" },
  { id: 10, name: "Pipefitter" },
  { id: 11, name: "Painter" },
  { id: 13, name: "Cleaning" },
  { id: 14, name: "Carpenter" },
  { id: 15, name: "Other" },
  { id: 16, name: "Machinist" },
  { id: 17, name: "Support - Gen. Labor" },
];

const areas = [
  { id: 1, name: "IBC Storage" },
  { id: 2, name: "Electrical Room" },
  { id: 3, name: "Cayenne" },
  { id: 4, name: "Half-caf" },
  { id: 5, name: "Firewater" },
  { id: 6, name: "Lotus Recycle" },
  { id: 7, name: "Lotus A" },
  { id: 8, name: "Lotus B" },
  { id: 9, name: "Mocha" },
  { id: 10, name: "Caramel" },
  { id: 11, name: "Caramel Compressor" },
  { id: 12, name: "Cooling Water" },
  { id: 13, name: "RAMA 2" },
  { id: 14, name: "O2" },
  { id: 15, name: "Emergency Generator" },
  { id: 16, name: "N2" },
  { id: 17, name: "RAMA 42" },
];

const groups = [
  { id: 1, name: "Concrete" },
  { id: 2, name: "Grout" },
  { id: 3, name: "Structural Steel" },
  { id: 4, name: "Mechanical Equipment" },
  { id: 5, name: "Above Ground Pipe" },
  { id: 6, name: "Mech Instrumentation" },
];

const commodities = [
  { id: 1, name: "Install" },
  { id: 2, name: "Install / Set" },
  { id: 3, name: "Install Instruments" },
  { id: 4, name: "Pour Concrete" },
  { id: 5, name: "Structural" },
];

const UOMs = [
  { id: 1, name: "CY" },
  { id: 2, name: "CF" },
  { id: 3, name: "SF" },
  { id: 4, name: "EA" },
  { id: 5, name: "LF" },
];

export default function QuantitiesPage() {
  const { data } = useSession();
  const user = data?.user;

  const [selectedCompany, setSelectedCompany] = useState(
    //companies.find((c) => c.id == intialQuantities[0]?.companyId || 1)
    {}
  );
  const [selectedRole, setSelectedRole] = useState({});
  const [selectedArea, setSelectedArea] = useState({});
  const [selectedGroup, setSelectedGroup] = useState({});
  const [selectedCommodity, setSelectedCommodity] = useState({});
  const [selectedUOM, setSelectedUOM] = useState({});

  const [estimatedQTY, setEstimatedQTY] = useState(0);
  const [periodQTY, setPeriodQTY] = useState(0);
  const [cumulativeInstalled, setCumulativeInstalled] = useState(0);

  const [quantities, setQuantities] = useState(
    //intialQuantities[0] || [{ id: "new-0", quantity: "", quantityTypeId: 1 }]
    {}
  );

  const onChangeCompany = (key) => {
    const company = companies.find((c) => c.id == key);
    const quantity = quantities.find((n) => n.companyId == key);

    setQuantityValues(quantity.quantity);
    setSelectedCompany(company);
    setSelectedQuantity(quantity);
  };

  const onQuantityChange = (e) => {
    const newQuantities = quantities.map((n) => {
      if (n.id === e.target.id) {
        n = { ...n, quantity: e.target.value };
      }
      return n;
    });
    console.log("New Quantities: ", newQuantities);
    setQuantities(newQuantities);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SafetySchema>({
    resolver: zodResolver(safetySchema),
    mode: "onTouched",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "quantities", // unique name for your Field Array
    }
  );

  const onSubmit = async () => {
    setQuantities((quantity) => ({
      ...quantity,
      userId: user.id,
      updatedAt: new Date(),
    }));
    //const result = await submitQuantity(quantities);
    // if (result.status === "success") {
    //   toast.success("Quantity saved.");
    // } else {
    //   console.log(result.error);
    // }
  };

  const onClickAuthorize = async () => {
    setSelectedQuantity({
      ...selectedQuantity,
      authorized: !selectedQuantity.authorized,
    });
    //const result = await authorizeQuantity(selectedQuantity);
  };

  const onChangeRole = (key) => {
    const newRole = roles.find((r) => r.id == key);
    setSelectedRole(newRole);
  };

  const onChangeArea = (key) => {
    const newArea = areas.find((r) => r.id == key);
    setSelectedArea(newArea);
  };

  const onChangeGroup = (key) => {
    const newGroup = groups.find((r) => r.id == key);
    setSelectedGroup(newGroup);
  };

  const onChangeCommodity = (key) => {
    const newCommodity = commodities.find((r) => r.id == key);
    setSelectedCommodity(newCommodity);
  };

  const onChangeUOM = (key) => {
    const newUOM = UOMs.find((r) => r.id == key);
    setSelectedUOM(newUOM);
  };

  const onChangeEstimateQTY = (e) => {
    setEstimatedQTY(e.target.value);
  };

  const onChangePeriodQTY = (e) => {
    setPeriodQTY(e.target.value);
  };

  const onChangeCumulativeInstalled = (e) => {
    setCumulativeInstalled(e.target.value);
  };

  const [quantityForms, setQuantityForms] = useState([]);

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Quantities</h1>
        </div>
        {user?.role === "ADMIN" && (
          <div className="mt-2">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" color="primary">
                  {selectedCompany.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                color="primary"
                variant="faded"
                aria-label="Static Actions"
                onAction={(key) => onChangeCompany(key)}
                selectionMode="single"
              >
                {companies.map((company) => (
                  <DropdownItem key={company.id}>{company.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-16 h-full">
            <div className="flex flex-row">
              <div className="flex flex-col mr-2">
                <span>Role</span>
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
                    onAction={(key) => onChangeRole(key)}
                    selectionMode="single"
                  >
                    {roles.map((role) => (
                      <DropdownItem key={role.id}>{role.name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex flex-col mr-2">
                <span>Area</span>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" color="primary">
                      {selectedArea.name ? selectedArea.name : "Select an Area"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="primary"
                    variant="faded"
                    aria-label="Static Actions"
                    onAction={(key) => onChangeArea(key)}
                    selectionMode="single"
                  >
                    {areas.map((area) => (
                      <DropdownItem key={area.id}>{area.name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex flex-col mr-2">
                <span>Group</span>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" color="primary">
                      {selectedGroup.name
                        ? selectedGroup.name
                        : "Select a Group"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="primary"
                    variant="faded"
                    aria-label="Static Actions"
                    onAction={(key) => onChangeGroup(key)}
                    selectionMode="single"
                  >
                    {groups.map((group) => (
                      <DropdownItem key={group.id}>{group.name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex flex-col mr-2">
                <span>Commodity</span>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" color="primary">
                      {selectedCommodity.name
                        ? selectedCommodity.name
                        : "Select a Commodity"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="primary"
                    variant="faded"
                    aria-label="Static Actions"
                    onAction={(key) => onChangeCommodity(key)}
                    selectionMode="single"
                  >
                    {commodities.map((commodity) => (
                      <DropdownItem key={commodity.id}>
                        {commodity.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex flex-col mr-2">
                <span>UOM</span>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered" color="primary">
                      {selectedUOM.name ? selectedUOM.name : "Select a UOM"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="primary"
                    variant="faded"
                    aria-label="Static Actions"
                    onAction={(key) => onChangeUOM(key)}
                    selectionMode="single"
                  >
                    {UOMs.map((UOM) => (
                      <DropdownItem key={UOM.id}>{UOM.name}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="flex flex-col mr-2">
                <Input
                  label="Estimate QTY"
                  type="number"
                  onChange={onChangeEstimateQTY}
                  value={estimatedQTY}
                />
              </div>
              <div className="flex flex-col mr-2">
                <Input
                  label="Period QTY"
                  type="number"
                  onChange={onChangePeriodQTY}
                  value={periodQTY}
                />
              </div>
              <div className="flex flex-col mr-2">
                <Input
                  label="Cumulative Installed"
                  type="number"
                  onChange={onChangeCumulativeInstalled}
                  value={cumulativeInstalled}
                />
              </div>
              <div className="flex flex-col mr-2">
                <Input
                  label="% Installed"
                  isReadOnly
                  value={
                    estimatedQTY && cumulativeInstalled && estimatedQTY > 0
                      ? ((cumulativeInstalled / estimatedQTY) * 100).toFixed(2)
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Button
              color="primary"
              onPress={() =>
                setQuantities([
                  ...quantities,
                  {
                    id: "new-" + quantities.length,
                    quantityTypeId: 1,
                    quantity: "",
                  },
                ])
              }
            >
              Add Quantity
            </Button>
          </div>
          <div className="mt-2">
            <Button
              color="primary"
              type="submit"
              isDisabled={!isValid || quantities[0].authorized}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
            {user?.role === "ADMIN" && (
              <Button
                className="ml-2"
                color="primary"
                isDisabled={!isValid}
                isLoading={isSubmitting}
                onPress={onClickAuthorize}
              >
                {quantities[0].authorized ? "Unauthorize" : "Authorize"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
