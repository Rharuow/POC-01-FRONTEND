import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { IFormOrder } from "../../order";

export function handleTotalPrice({
  watch,
  setValue,
}: {
  watch: UseFormWatch<IFormOrder>;
  setValue: UseFormSetValue<IFormOrder>;
}) {
  const totalPrice = watch("orderItems")
    .map((_, index) => watch(`orderItems.${index}.totalPrice`))
    .reduce((acc, total) => (acc = Number(acc) + Number(total)), 0);
  setValue("totalPrice", String(totalPrice));
}
