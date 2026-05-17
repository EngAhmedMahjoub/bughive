"use client";

import { Issue, Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const statuses: { label: string; value: Status }[] = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const StatusSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();

  const changeStatus = (status: Status) => {
    axios
      .patch("/api/issues/" + issue.id, { status })
      .then(() => router.refresh())
      .catch(() => toast.error("Changes could not be saved."));
  };

  return (
    <>
      <Select.Root defaultValue={issue.status} onValueChange={changeStatus}>
        <Select.Trigger placeholder="Set status..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Status</Select.Label>
            {statuses.map((s) => (
              <Select.Item key={s.value} value={s.value}>
                {s.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
};

export default StatusSelect;
