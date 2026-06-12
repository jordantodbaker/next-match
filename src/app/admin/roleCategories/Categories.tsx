"use client";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import React from "react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { toast } from "react-toastify";
import { RoleCategory } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import {
  deleteCategory,
  saveCategory,
} from "@/app/actions/roleCategoryActions";
import CategoryTable from "./CategoryTable";
import { emptyRoleCategory } from "@/lib/schemas/defaultModels";

type Props = {
  categories: RoleCategory[];
};

export default function Categories({ categories: initialCategories }: Props) {
  const data = { user: useCurrentUser() };
  const user = data?.user;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] =
    useState<RoleCategory>(emptyRoleCategory);

  const handleNameChange = (name: string) => {
    const newCategory = { ...selectedCategory, name: name };
    setSelectedCategory(newCategory);
  };

  const handleDescriptionChange = (description: string) => {
    const newCategory = { ...selectedCategory, description: description };
    setSelectedCategory(newCategory);
  };

  const onSaveCategory = async () => {
    const category = { ...selectedCategory };
    console.log("Category: ", category);
    const result = await saveCategory(category);
    const newCategories =
      category.id === 0
        ? [...categories, category]
        : categories.map((c) => {
            if (c.id === category.id || c.id === 0) {
              return category;
            }
            return c;
          });

    setCategories(newCategories);

    if (result.status === "success") {
      toast.success("Category Saved.");
    } else {
      toast.error(result.error);
    }
  };

  const onDeleteCategory = async () => {
    const category = { ...selectedCategory };
    const result = await deleteCategory(category);

    if (result.status === "success") {
      const newCategories = categories.filter(
        (t) => t.name !== selectedCategory.name
      );
      setCategories(newCategories);
      toast.success("Category Deleted.");
    } else {
      toast.error(result.error);
    }
  };

  const onClickEditCategory = async (category: RoleCategory) => {
    setSelectedCategory(category);
    onOpen();
  };

  const onClickDeleteCategory = (category: RoleCategory) => {
    setSelectedCategory(category);
    onDeleteOpen();
  };

  const onToggleIsDirect = (e: any) => {
    setSelectedCategory({
      ...selectedCategory,
      isDirect: !selectedCategory.isDirect,
    });
  };

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Categories</h1>
        </div>
        <CategoryTable
          categories={categories}
          onClickEditCategory={onClickEditCategory}
          onClickDeleteCategory={onClickDeleteCategory}
        />

        <div className="mt-4">
          <Button
            className="mr-4"
            color="primary"
            type="button"
            onPress={() => {
              setSelectedCategory(emptyRoleCategory);
              onOpen();
            }}
          >
            Add Category
          </Button>
        </div>
        <Modal
          isOpen={isOpen}
          placement="top-center"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedCategory.id === 0 ? "Add Category" : "Edit Category"}
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Name"
                    placeholder="Category Name"
                    variant="bordered"
                    value={selectedCategory.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Description"
                    variant="bordered"
                    value={selectedCategory.description || ""}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                  />
                  <div className="flex py-2 px-1 justify-between">
                    <Checkbox
                      onChange={(e) => onToggleIsDirect(e)}
                      defaultChecked={selectedCategory.isDirect}
                      isSelected={selectedCategory.isDirect}
                    >
                      Direct
                    </Checkbox>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      onClose();
                      await onSaveCategory();
                    }}
                  >
                    {selectedCategory.id === 0
                      ? "Add Category"
                      : "Edit Category"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isDeleteOpen}
          placement="top-center"
          onOpenChange={onDeleteOpenChange}
        >
          <ModalContent>
            {(onDeleteClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedCategory.id === 0 ? "Add Category" : "Edit Category"}
                </ModalHeader>
                <ModalBody>
                  <div>
                    Are you just you want to delete {selectedCategory.name}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onDeleteClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      onDeleteClose();
                      await onDeleteCategory();
                    }}
                  >
                    Delete {selectedCategory.name}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
