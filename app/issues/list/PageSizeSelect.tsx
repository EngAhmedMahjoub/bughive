"use client";

import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from "./pageSizes";

const PageSizeSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = (() => {
    const raw = parseInt(searchParams.get("pageSize") || "");
    return (PAGE_SIZES as readonly number[]).includes(raw) ?
        raw
      : DEFAULT_PAGE_SIZE;
  })();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", value);
    // Reset to first page when page size changes.
    params.delete("page");
    router.push("/issues/list?" + params.toString());
  };

  return (
    <Select.Root value={current.toString()} onValueChange={onChange}>
      <Select.Trigger placeholder="Page size" />
      <Select.Content>
        {PAGE_SIZES.map((size) => (
          <Select.Item key={size} value={size.toString()}>
            {size} / page
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default PageSizeSelect;
