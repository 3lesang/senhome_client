import { Combobox } from "@/components/combobox";
import { queryClient } from "@/stores/query";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface DistrictSelectProps {
  value?: string;
  onChange?: (values: { label: string; value: string }) => void;
  province?: string;
}

function DistrictSelect({ province, value, onChange }: DistrictSelectProps) {
  const client = useStore(queryClient);

  const { data: districts } = useQuery(
    {
      queryKey: ["districts", province],
      queryFn: () =>
        axios.get(`https://open.oapi.vn/location/districts/${province}`, {
          params: {
            page: 0,
            size: 100,
          },
        }),

      enabled: !!province,
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
      options={districts || []}
      placeholder="Quận/Huyện"
      disabled={!province}
    />
  );
}

export default DistrictSelect;
