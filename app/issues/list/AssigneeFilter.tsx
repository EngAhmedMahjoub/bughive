"use client";

import { Skeleton } from "@/app/components";
import { User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const ALL = "all";
const UNASSIGNED = "unassigned";

const AssigneeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("assignee") || ALL;

  const { data: users, error, isLoading } = useUsers();

  if (isLoading) return <Skeleton width="10rem" />;
  if (error) return null;

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === ALL) params.delete("assignee");
    else params.set("assignee", value);
    // Reset to first page when filter changes.
    params.delete("page");
    router.push("/issues/list?" + params.toString());
  };

  return (
    <Select.Root value={current} onValueChange={onChange}>
      <Select.Trigger placeholder="Filter by assignee..." />
      <Select.Content>
        <Select.Group>
          <Select.Item value={ALL}>All assignees</Select.Item>
          <Select.Item value={UNASSIGNED}>Unassigned</Select.Item>
        </Select.Group>
        {users && users.length > 0 && (
          <Select.Group>
            <Select.Label>Users</Select.Label>
            {users.map((u) => (
              <Select.Item key={u.id} value={u.id}>
                {u.name || u.email || u.id}
              </Select.Item>
            ))}
          </Select.Group>
        )}
      </Select.Content>
    </Select.Root>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

export default AssigneeFilter;
