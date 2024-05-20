import { Document } from "@/components/resources/document/document";
import { Address } from "@/components/resources/address/address";

export type Client = {
  id?: string;
  name?: string;
  email?: string;
  document?: Document;
  address?: Address;
};

export interface IFormClient {
  name: string;
  email: string;
  cpf: string;
  cnpj: string;
  billing: string;
  delivery: string;
}
