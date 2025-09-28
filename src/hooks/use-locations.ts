import { useEffect, useState } from 'react';
import { Option } from '@models/utils-model';
import { useDistrictsQuery, useLazyUpazilasQuery } from '@services/locations-service';

export const useDistricts = () => {
  const [districtOptions, setDistrictOptions] = useState<Option[]>([]);
  
  const { isLoading, data, isSuccess } = useDistrictsQuery();
  
  useEffect(() => {
    if (isSuccess && data) {
      const options = data.map((district) => ({
        label: district.name,
        value: district.id
      }));
      
      setDistrictOptions(options);
    }
  }, [isSuccess, data]);
  
  return {
    isDistrictLoading: isLoading,
    districtOptions
  };
};

export const useUpazilas = () => {
  const [upazilaOptions, setUpazilaOptions] = useState<Option[]>([]);
  
  const [onLoad, { isLoading, data, isSuccess }] = useLazyUpazilasQuery();
  
  const onLoadUpazilas = (districtId: number) => {
    onLoad(districtId);
  };
  
  useEffect(() => {
    if (isSuccess && data) {
      const options = data.map((upazila) => ({
        label: upazila.name,
        value: upazila.id
      }));
      
      setUpazilaOptions(options);
    }
  }, [isSuccess, data]);
  
  return {
    onLoadUpazilas,
    isUpazilaLoading: isLoading,
    upazilaOptions
  };
};