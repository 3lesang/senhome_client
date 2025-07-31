import { Combobox } from "@/components/combobox";
import { queryClient } from "@/stores/query";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ProvinceSelectProps {
  value?: string;
  onChange?: (values: { label: string; value: string }) => void;
}

function ProvinceSelect({ value, onChange }: ProvinceSelectProps) {
  const client = useStore(queryClient);
  const { data: provinces } = useQuery(
    {
      queryKey: ["provinces"],
      queryFn: () =>
        axios.get("https://open.oapi.vn/location/provinces", {
          params: {
            page: 0,
            size: 100,
          },
        }),
      select(data) {
        return data?.data?.data?.map((item: any) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        });
      },
    },
    client
  );
  return (
    <Combobox
      value={value}
      onChange={onChange}
      options={provinces || []}
      placeholder="Tỉnh/Thành phố"
    />
  );
}

export default ProvinceSelect;
