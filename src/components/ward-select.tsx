import { Combobox } from "@/components/combobox";
import { queryClient } from "@/stores/query";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface WardSelectProps {
  value?: string;
  onChange?: (values: { label: string; value: string }) => void;
  district?: string;
}

function WardSelect({ district, value, onChange }: WardSelectProps) {
  const client = useStore(queryClient);

  const { data: wards } = useQuery(
    {
      queryKey: ["wards", district],
      queryFn: () =>
        axios.get(`https://open.oapi.vn/location/wards/${district}`, {
          params: {
            page: 0,
            size: 100,
          },
        }),

      enabled: !!district,
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
      options={wards || []}
      placeholder="Xã/Phường"
      disabled={!district}
    />
  );
}

export default WardSelect;
