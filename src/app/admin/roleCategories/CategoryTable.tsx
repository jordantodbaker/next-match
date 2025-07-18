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

export const columns = [
  { name: "CATEGORY", uid: "category" },
  { name: "DESCRIPTION", uid: "description" },
  { name: "DIRECT", uid: "isDirect" },
  { name: "ACTIONS", uid: "actions" },
];

type Props = {
  categories: RoleCategory[];
  onClickEditCategory: (category: RoleCategory) => void;
  onClickDeleteCategory: (category: RoleCategory) => void;
};

export default function CategoryTable({
  categories,
  onClickEditCategory,
  onClickDeleteCategory,
}: Props) {
  console.log("Categoriess", categories);
  const renderCell = useCallback((category: RoleCategory, columnKey: any) => {
    const cellValue = category[columnKey as keyof RoleCategory];

    switch (columnKey) {
      case "category":
        return <div>{category.name}</div>;
      case "code":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize ">
              {category.description}
            </p>
          </div>
        );
      case "isDirect":
        return <div>{category.isDirect ? "Yes" : "No"}</div>;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              color="primary"
              variant="bordered"
              onPress={async () => onClickEditCategory(category)}
            >
              Edit
            </Button>
            <Button
              color="primary"
              variant="bordered"
              onPress={() => onClickDeleteCategory(category)}
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
      <TableBody items={categories}>
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
