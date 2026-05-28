import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchSettings, updateSettings } from "../../services/admin";
import { Spinner } from "../../components/Loader/Spinner";

import { FormCard, Input, Button } from "./styledComponents";

export const Settings = () => {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      toast.success("System settings saved!");
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h2 style={{ marginBottom: "24px" }}>System Settings</h2>
      <FormCard onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <label>System Name</label>
        <Input {...register("system_name")} />

        <label>Support Email</label>
        <Input type="email" {...register("support_email")} />

        <label>Website URL</label>
        <Input {...register("website")} />

        <label>Default Currency</label>
        <Input {...register("currency")} />

        <Button type="submit" disabled={mutation.isLoading}>
          Save Changes
        </Button>
      </FormCard>
    </div>
  );
};
