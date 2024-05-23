import { UseFieldArrayRemove } from "react-hook-form";

export function handleRemove({
  index,
  remove,
}: {
  index: number;
  remove: UseFieldArrayRemove;
}) {
  remove(index);
}
