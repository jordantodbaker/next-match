import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { Company } from "@/lib/types";

export const columns = [
  { name: "COMPANY", uid: "company" },
  { name: "CODE", uid: "code" },
  { name: "PROJECTS", uid: "projects" },
  { name: "REPORT", uid: "report" },
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
  const renderCell = (company: Company, columnKey: string) => {
    switch (columnKey) {
      case "company":
        return <span className="font-medium">{company.name}</span>;
      case "code":
        return <span className="text-default-500">{company.companyCode}</span>;
      case "projects":
        return (
          <span className="text-default-500">
            {company.projects?.length ?? 0}
          </span>
        );
      case "report":
        return company.powerBiUrl ? (
          <Chip size="sm" variant="flat" color="primary">
            Configured
          </Chip>
        ) : (
          <span className="text-default-400">—</span>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => onClickEditCompany(company)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="danger"
              onPress={() => onClickDeleteCompany(company)}
            >
              Delete
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Table aria-label="Companies" removeWrapper>
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
              <TableCell>{renderCell(item, columnKey as string)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
