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

import { EditIcon, DeleteIcon } from "@/lib/icons";
import { useCallback } from "react";
import { CompanyAccount } from "@prisma/client";
import { Company } from "@/lib/types";

export const columns = [
  { name: "COMPANY", uid: "company" },
  { name: "CODE", uid: "code" },
  { name: "ACTIONS", uid: "actions" },
];

type Props = {
  companies: Company[];
  onClickEditCompany: (company: Company) => void;
  onClickDeleteCompany: (company: Company) => void;
};

export default function CompanyTable({
  companies,
  onClickEditCompany,
  onClickDeleteCompany,
}: Props) {
  const renderCell = useCallback((company: Company, columnKey: any) => {
    const cellValue = company[columnKey as keyof CompanyAccount];

    switch (columnKey) {
      case "company":
        return <div>{company.name}</div>;
      case "code":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize ">
              {company.companyCode}
            </p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              color="primary"
              variant="bordered"
              onPress={async () => onClickEditCompany(company)}
            >
              Edit
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onPress={() => onClickDeleteCompany(company)}
            >
              Delete
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Companies">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={companies} emptyContent="No companies yet.">
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
