"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();
  return <Button {...props} disabled={pending} variant="default"></Button>;
}

export default SubmitButton;
