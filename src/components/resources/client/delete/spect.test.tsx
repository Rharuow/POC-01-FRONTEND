import { MockedProvider } from "@apollo/client/testing"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner";

import DeleteClient from "."
import { Client } from "../client"
import { DELETE_CLIENT } from "@/service/mutation/client"

// Mock the toast function
jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

const mockCpf = "123.456.789-09"
const mockCnpj = "00.872.916/0001-31"

const mocks = [{
  request: {
    query: DELETE_CLIENT,
    variables: {
      id: '1',
    },
  },
  result: {
    data: {
      deleteClient: {
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
}]


const clientMocked: Client = {
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
}

const setup = () => {
  const result = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <DeleteClient client={clientMocked} initialDeleteModalIsOpen={true} />
    </MockedProvider>
  )

  const user = userEvent.setup()

  return { result, user }
}

describe("Creating a new client", () => {
  it("When the user click in 'Deletar' button, a toast is trigged with text 'Cliente deletado com sucesso...'", async () => {
    const { user } = setup()
    screen.logTestingPlaygroundURL()

    const btnDelete = screen.getByRole("button", { name: /deletar/i })

    await user.click(btnDelete)

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Cliente deletado com sucesso...');
    })
  })
})
