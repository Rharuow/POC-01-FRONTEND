import "@testing-library/jest-dom";
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from "sonner";

import { MockedProvider } from "@apollo/client/testing";
import { FormCreateClient } from "./form";
import { Dialog } from "@/components/ui/dialog";
import { CREATE_CLIENT } from "@/service/mutation/client";
import { GET_CLIENTS } from "@/service/queries/clients";


const mockCepData = {
  uf: 'CE',
  localidade: 'Fortaleza',
  bairro: 'Bom Jardim',
  logradouro: 'Travessa Getúlio Vargas',
};

const mockCpf = "123.456.789-09"
const mockCnpj = "00.872.916/0001-31"

// Mock the toast function
jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

// Mocking viacepAPI
jest.mock('../../../../service/viacep', () => ({
  viacepAPI: {
    get: jest.fn(async () => await Promise.resolve({ data: mockCepData })),
  },
}));

const mockRequestsCreateClient = {
  request: {
    query: CREATE_CLIENT,
    variables: {
      name: 'John Doe',
      email: 'john@example.com',
      billing: '2, 60543-480 - Travessa Getúlio Vargas, Bom Jardim - Fortaleza, CE ',
      delivery: '2, 60543-480 - Travessa Getúlio Vargas, Bom Jardim - Fortaleza, CE ',
      cpf: '',
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
          billing: '2, 60543-480 - Travessa Getúlio Vargas, Bom Jardim - Fortaleza, CE ',
          delivery: '2, 60543-480 - Travessa Getúlio Vargas, Bom Jardim - Fortaleza, CE ',
        },
        document: {
          cpf: mockCpf,
          cnpj: mockCnpj,
        }
      },
    },
  },
}

const mocks = [
  mockRequestsCreateClient,
  {
    request: {
      query: GET_CLIENTS,
    },
    result: {
      data: {
        getClients: [
          {
            id: '1',
            name: 'Existing Client',
            email: 'existing@example.com',
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
  },
];

const setup = () => {
  const result = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Dialog open={true}>
        <FormCreateClient />
      </Dialog>
    </MockedProvider>
  )

  const user = userEvent.setup()

  return { result, user }
}

describe("Creating a new client", () => {
  it(`When a user submit the form without fill required fields, should the alerts must be showed in all of this fields`, async () => {
    const { user } = setup()

    const btnSubmit = screen.getByRole('button', {
      name: /Salvar/i
    })

    await user.click(btnSubmit)

    const [alerts, ...spans] = await Promise.all([
      screen.findAllByRole("alert"),
      screen.findByText('Pelo menos 4 caracteres'),
      screen.findByText('Este é um email inválido.'),
      screen.findByText('Endereço de cobrança é obrigatório'),
      screen.findByText('Endereço de entrega é obrigatório'),
      screen.findByText('CPF é obrigatório')
    ])


    expect(alerts).toHaveLength(5)
    spans.forEach((span) => {
      expect(span).toBeVisible()
    })
  })

  it(`When a user clicks on the 'CNPJ' tab and submit the form without fill required fields, should the alerts must be showed in all of this fields`, async () => {
    const { user } = setup()
    const btnTabCNPJ = screen.getByText("CNPJ")
    const btnSubmit = screen.getByRole('button', {
      name: /Salvar/i
    })

    let fields = await screen.findAllByRole("textbox")

    // Check if the cpf field is includes in form
    expect(fields.some(field => field.getAttribute("name") === "cpf")).toBeTruthy()

    // Check if the cnpj field isn't includes in form
    expect(fields.some(field => field.getAttribute("name") === "cnpj")).toBeFalsy()

    await user.click(btnTabCNPJ)

    fields = await screen.findAllByRole("textbox")

    // Check if the cpf field isn't includes in form
    expect(fields.some(field => field.getAttribute("name") === "cpf")).toBeFalsy()

    // Check if the cnpj field is includes in form
    expect(fields.some(field => field.getAttribute("name") === "cnpj")).toBeTruthy()

    await user.click(btnSubmit)

    const [alerts, ...spans] = await Promise.all([
      screen.findAllByRole("alert"),
      screen.findByText('Pelo menos 4 caracteres'),
      screen.findByText('Este é um email inválido.'),
      screen.findByText('Endereço de cobrança é obrigatório'),
      screen.findByText('Endereço de entrega é obrigatório'),
      screen.findByText('CNPJ é obrigatório')
    ])


    expect(alerts).toHaveLength(5)
    spans.forEach((span) => {
      expect(span).toBeVisible()
    })
  })

  it(`When a user attempts to submit a form to create a client filling in the required fields, a toast is trigged with text 'Cliente criado com sucesso'`, async () => {
    mockRequestsCreateClient.request.variables.cpf = mockCpf
    const { user } = setup()
    const mockedCEP = "60543-480"
    const mockedNumber = "2"

    const nameInput = screen.getByRole("textbox", { name: /nome/i })
    const emailInput = screen.getByRole("textbox", { name: /email/i })

    const billingInput = screen.getByRole("textbox", { name: /endereço de cobrança/i })
    const deliveryInput = screen.getByRole("textbox", { name: /endereço de entrega/i })

    const cpfInput = screen.getByRole("textbox", { name: /cpf/i })

    const btnSubmit = screen.getByRole('button', {
      name: /salvar/i
    })

    // Fill in the form fields
    await user.type(nameInput, mockRequestsCreateClient.request.variables.name);
    await user.type(emailInput, mockRequestsCreateClient.request.variables.email);

    // add flow of billing input modal with cep and number field
    await user.click(billingInput);
    let cepInput = screen.getByRole("textbox", { name: /cep/i })
    let numberInput = screen.getByRole("textbox", { name: /número/i })
    let saveAddressButton = screen.getAllByRole("button", { name: /salvar/i })[1]
    await user.type(cepInput, mockedCEP)
    await user.type(numberInput, mockedNumber)
    await user.click(saveAddressButton)

    await user.click(deliveryInput);
    cepInput = screen.getByRole("textbox", { name: /cep/i })
    numberInput = screen.getByRole("textbox", { name: /número/i })
    saveAddressButton = screen.getAllByRole("button", { name: /salvar/i })[1]
    await user.type(cepInput, mockedCEP)
    await user.type(numberInput, mockedNumber)
    await user.click(saveAddressButton)

    await user.click(cpfInput)
    await user.type(cpfInput, mockRequestsCreateClient.request.variables.cpf);

    await user.click(btnSubmit)

    // Check if the success toast was shown
    await waitFor(() => {
      // Check if the toast was called with the success message
      expect(toast).toHaveBeenCalledWith('Cliente criado com sucesso');
    });

  })

  it(`When a user clicks on the 'CNPJ' tab and submit the form filling requir  ed fields, a toast is trigged with text 'Cliente criado com sucesso`, async () => {
    // reseting mock apollo request to cpnj case
    mockRequestsCreateClient.request.variables.cpf = ''
    mockRequestsCreateClient.request.variables.cnpj = mockCnpj
    const { user } = setup()

    const mockedCEP = "60543-480"
    const mockedNumber = "2"

    const nameInput = screen.getByRole("textbox", { name: /nome/i })
    const emailInput = screen.getByRole("textbox", { name: /email/i })

    const billingInput = screen.getByRole("textbox", { name: /endereço de cobrança/i })
    const deliveryInput = screen.getByRole("textbox", { name: /endereço de entrega/i })

    const btnTabCNPJ = screen.getByText("CNPJ")
    const btnSubmit = screen.getByRole('button', {
      name: /Salvar/i
    })

    await user.click(btnTabCNPJ)

    const cnpjInput = screen.getByRole("textbox", { name: /cnpj/i })

    let fields = await screen.findAllByRole("textbox")

    // Check if the cpf field isn't includes in form
    expect(fields.some(field => field.getAttribute("name") === "cpf")).toBeFalsy()

    // Check if the cnpj field is includes in form
    expect(fields.some(field => field.getAttribute("name") === "cnpj")).toBeTruthy()


    // Fill in the form fields
    await user.type(nameInput, mockRequestsCreateClient.request.variables.name);
    await user.type(emailInput, mockRequestsCreateClient.request.variables.email);

    // add flow of billing input modal with cep and number field
    await user.click(billingInput);
    let cepInput = screen.getByRole("textbox", { name: /cep/i })
    let numberInput = screen.getByRole("textbox", { name: /número/i })
    let saveAddressButton = screen.getAllByRole("button", { name: /salvar/i })[1]
    await user.type(cepInput, mockedCEP)
    await user.type(numberInput, mockedNumber)
    await user.click(saveAddressButton)

    await user.click(deliveryInput);
    cepInput = screen.getByRole("textbox", { name: /cep/i })
    numberInput = screen.getByRole("textbox", { name: /número/i })
    saveAddressButton = screen.getAllByRole("button", { name: /salvar/i })[1]
    await user.type(cepInput, mockedCEP)
    await user.type(numberInput, mockedNumber)
    await user.click(saveAddressButton)

    await user.click(cnpjInput)
    await user.type(cnpjInput, mockRequestsCreateClient.request.variables.cnpj);

    await user.click(btnSubmit)

    // Check if the success toast was shown
    await waitFor(() => {
      // Check if the toast was called with the success message
      expect(toast).toHaveBeenCalledWith('Cliente criado com sucesso');
    });
  })

  it(`When a user fill all the input including cnpj and cpf, a toast is trigged with text 'Cliente criado com sucesso`, async () => {
    // reseting mock apollo request to cpnj case
    mockRequestsCreateClient.request.variables.cpf = mockCpf
    mockRequestsCreateClient.request.variables.cnpj = mockCnpj
    const { user } = setup()

    const mockedCEP = "60543-480"
    const mockedNumber = "2"

    const nameInput = screen.getByRole("textbox", { name: /nome/i })
    const emailInput = screen.getByRole("textbox", { name: /email/i })

    const billingInput = screen.getByRole("textbox", { name: /endereço de cobrança/i })
    const deliveryInput = screen.getByRole("textbox", { name: /endereço de entrega/i })

    const btnTabCNPJ = screen.getByText("CNPJ")
    const btnSubmit = screen.getByRole('button', {
      name: /Salvar/i
    })

    const cpfInput = screen.getByRole("textbox", { name: /cpf/i })

    await user.type(cpfInput, mockCpf)

    await user.click(btnTabCNPJ)

    const cnpjInput = screen.getByRole("textbox", { name: /cnpj/i })

    let fields = await screen.findAllByRole("textbox")

    // Check if the cpf field isn't includes in form
    expect(fields.some(field => field.getAttribute("name") === "cpf")).toBeFalsy()

    // Check if the cnpj field is includes in form
    expect(fields.some(field => field.getAttribute("name") === "cnpj")).toBeTruthy()


    // Fill in the form fields
    await user.type(nameInput, mockRequestsCreateClient.request.variables.name);
    await user.type(emailInput, mockRequestsCreateClient.request.variables.email);

    // add flow of billing input modal with cep and number field
    await user.click(billingInput);
    let cepInput = screen.getByRole("textbox", { name: /cep/i })
    let numberInput = screen.getByRole("textbox", { name: /número/i })
    let saveAddressButton = screen.getAllByRole("button", { name: /salvar/i })[1]
    await user.type(cepInput, mockedCEP)
    await user.type(numberInput, mockedNumber)
    await user.click(saveAddressButton)

    await user.click(deliveryInput);
    cepInput = screen.getByRole("textbox", { name: /cep/i })
    numberInput = screen.getByRole("textbox", { name: /número/i })
    saveAddressButton = screen.getAllByRole("button", { name: /salvar/i })[1]
    await user.type(cepInput, mockedCEP)
    await user.type(numberInput, mockedNumber)
    await user.click(saveAddressButton)

    await user.click(cnpjInput)
    await user.type(cnpjInput, mockRequestsCreateClient.request.variables.cnpj);

    await user.click(btnSubmit)

    // Check if the success toast was shown
    await waitFor(() => {
      // Check if the toast was called with the success message
      expect(toast).toHaveBeenCalledWith('Cliente criado com sucesso');
    });
  })
})