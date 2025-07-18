import React from "react";
import Categories from "./Categories";
import { getCategories } from "../../actions/roleCategoryActions";

export default async function RoleCategoryPage() {
  const categories = await getCategories();
  return (
    <div className="flex h-full w-full">
      <Categories categories={categories} />
    </div>
  );
}
