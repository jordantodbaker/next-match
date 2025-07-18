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
import { RoleCategory } from "@prisma/client";
import { Role } from "@/lib/types";

export const columns = [
  { name: "ROLE", uid: "role" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "CODE", uid: "code" },
  { name: "CATEGORY", uid: "category" },
  { name: "ACTIONS", uid: "actions" },
];

type Props = {
  roles: Role[];
  categories: RoleCategory[];
  onClickEditRole: (role: Role) => void;
  onClickDeleteRole: (role: Role) => void;
};

export default function RoleTable({
  roles,
  categories,
  onClickEditRole,
  onClickDeleteRole,
}: Props) {
  const renderCell = useCallback((role: Role, columnKey: any) => {
    const cellValue = role[columnKey as keyof Role];

    switch (columnKey) {
      case "role":
        return <div>{role.name}</div>;
      case "description":
        return <div>{role.description}</div>;
      case "code":
        return <div>{role.code}</div>;
      case "category":
        return <div>{role.category.name}</div>;

      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              color="primary"
              variant="bordered"
              onPress={async () => onClickEditRole(role)}
            >
              Edit
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onPress={() => onClickDeleteRole(role)}
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
    <Table aria-label="Example table with custom cells">
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
      <TableBody items={roles}>
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
