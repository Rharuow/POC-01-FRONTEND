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
  billing: string;
  delivery: string;
  cpf: string;
  cnpj: string;
  zipCode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
}
