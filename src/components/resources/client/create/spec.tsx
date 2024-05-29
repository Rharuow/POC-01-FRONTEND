import "@testing-library/jest-dom";
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { toast } from "sonner";

import { MockedProvider } from "@apollo/client/testing";
import { FormCreateClient } from "./form";
import { Dialog } from "@/components/ui/dialog";
import { CREATE_CLIENT } from "@/service/mutation/client";
import { GET_CLIENTS } from "@/service/queries/clients";

// Mock the toast function
jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

const mockRequest = {
  request: {
    query: CREATE_CLIENT,
    variables: {
      name: 'John Doe',
      email: 'john@example.com',
      billing: 'test address billing',
      delivery: 'test address delivery',
      cpf: '123.456.789-09',
      cnpj: '',
    },
  },
  result: {
    data: {
      createClient: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        address: {
          billing: 'test address billing',
          delivery: 'test address delivery',
        },
        document: {
          cpf: '123.456.789-09',
          cnpj: '',
        }
      },
    },
  },
}

const mockResponse = {
  request: {
    query: GET_CLIENTS,
  },
  result: {
    data: {
      getClients: [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          address: {
            billing: 'test address billing',
            delivery: 'test address delivery',
          },
          document: {
            cpf: '123.456.789-09',
            cnpj: '',
          }
        },
      ],
    },
  },
}

const mocks = [
  mockRequest,
  mockResponse
];

const setup = () => {
  const utils = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Dialog open={true}>
        <FormCreateClient />
      </Dialog>
    </MockedProvider>
  )

  const nameInput = screen.getByRole("textbox", { name: /Nome/i })
  const emailInput = screen.getByRole("textbox", { name: /Email/i })
  const billingInput = screen.getByRole("textbox", { name: /Endereço de cobrança/i })
  const deliveryInput = screen.getByRole("textbox", { name: /Endereço de entrega/i })
  const cpfInput = screen.getByRole("textbox", { name: /CPF/i })

  const btnSubmit = screen.getByText('Salvar')
  const btnTabCNPJ = screen.getByText("CNPJ")

  return {
    btnSubmit,
    btnTabCNPJ,
    nameInput,
    emailInput,
    billingInput,
    deliveryInput,
    cpfInput,
    ...utils
  }
}

it(`When a user attempts to submit a form to create a client without filling in the required fields, including 'name', 'email', 'billing', 'delivery', and 'CPF', the spans below these fields appear with feedback indicating the necessary requirements to validate each field: 
- name: 'Pelo menos 4 caracteres' 
- email: 'Este é um email inválido.'
- billing: 'Endereço de cobrança é obrigatório' 
- delivery: 'Endereço de entrega é obrigatório' 
- cpf: 'CPF obrigatório' 
`, async () => {
  const { btnSubmit } = setup()

  fireEvent.submit(btnSubmit)

  const spanAlerts = await screen.findAllByRole("alert")

  expect(spanAlerts).toHaveLength(5)
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'name')?.innerHTML).toBe('Pelo menos 4 caracteres')
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'email')?.innerHTML).toBe('Este é um email inválido.')
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'billing')?.innerHTML).toBe('Endereço de cobrança é obrigatório')
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'delivery')?.innerHTML).toBe('Endereço de entrega é obrigatório')
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'cpf')?.innerHTML).toBe('CPF é obrigatório')
})

it(`When a user clicks on the 'CNPJ' tab and attempts to submit the form without filling it, the feedback spans below the fields appear with similar feedback to the previous test, except for the 'CPF' field, which is replaced by 'CNPJ':
- name: 'Pelo menos 4 caracteres' 
- email: 'Este é um email inválido.'
- billing: 'Endereço de cobrança é obrigatório' 
- delivery: 'Endereço de entrega é obrigatório' 
- cnpj: "CNPJ é obrigatório"
`, async () => {
  const { btnSubmit, btnTabCNPJ } = setup()

  let fields = await screen.findAllByRole("textbox")

  // Check if the cpf field is includes in form
  expect(fields.some(field => field.getAttribute("name") === "cpf")).toBeTruthy()

  // Check if the cnpj field isn't includes in form
  expect(fields.some(field => field.getAttribute("name") === "cnpj")).toBeFalsy()

  fireEvent.mouseDown(btnTabCNPJ)

  fields = await screen.findAllByRole("textbox")

  // Check if the cpf field isn't includes in form
  expect(fields.some(field => field.getAttribute("name") === "cpf")).toBeFalsy()

  // Check if the cnpj field is includes in form
  expect(fields.some(field => field.getAttribute("name") === "cnpj")).toBeTruthy()

  fireEvent.submit(btnSubmit)

  const spanAlerts = await screen.findAllByRole("alert")

  expect(spanAlerts).toHaveLength(5)
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'name')?.innerHTML).toBe('Pelo menos 4 caracteres')
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'email')?.innerHTML).toBe('Este é um email inválido.')
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'billing')?.innerHTML).toBe('Endereço de cobrança é obrigatório')
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'delivery')?.innerHTML).toBe('Endereço de entrega é obrigatório')
  expect(spanAlerts.find(spanAlert => spanAlert.getAttribute("id") === 'cnpj')?.innerHTML).toBe('CNPJ é obrigatório')
})

it(`When a user attempts to submit a form to create a client filling in the required fields, including 'name', 'email', 'billing', 'delivery', and 'CPF', a toast is trigged with text 'Cliente criado com sucesso'`, async () => {
  const { btnSubmit, nameInput, emailInput, billingInput, deliveryInput, cpfInput } = setup()

  // Fill in the form fields
  fireEvent.input(nameInput, { target: { value: mockRequest.request.variables.name } });
  fireEvent.input(emailInput, { target: { value: mockRequest.request.variables.email } });


  // Assuming there are fields for billing and delivery addresses
  fireEvent.input(billingInput, { target: { value: mockRequest.request.variables.billing } });
  fireEvent.input(deliveryInput, { target: { value: mockRequest.request.variables.delivery } });

  fireEvent.input(cpfInput, { target: { value: mockRequest.request.variables.cpf } });

  fireEvent.submit(btnSubmit)

  // Check if the success toast was shown
  await waitFor(() => {
    // Check if the toast was called with the success message
    expect(toast).toHaveBeenCalledWith('Cliente criado com sucesso');
  });

})