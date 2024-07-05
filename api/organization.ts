import api from '@/api/api';
import { useMutation } from '@tanstack/react-query';

export interface CreateOrganization {
  organizationName: string;
  email: string;
  displayName: string;
  password: string;
}

const createOrganization = async (organization: CreateOrganization) => {
  return api.post('/organization', organization).then((res) => res.data);
};

const updateOrganization = async (organizationName: string) => {
  return api
    .patch(`/organization`, { name: organizationName })
    .then((res) => res.data);
};

export const useCreateOrganization = () => {
  return useMutation({
    mutationFn: (organization: CreateOrganization) =>
      createOrganization(organization)
  });
};

export const useUpdateOrganization = () => {
  return useMutation({
    mutationFn: (organizationName: string) =>
      updateOrganization(organizationName)
  });
};
