import "@testing-library/jest-dom";
import { screen, render, fireEvent } from '@testing-library/react'

import { MockedProvider } from "@apollo/client/testing";
import { FormCreateClient } from "./form";
import { Dialog } from "@/components/ui/dialog";

const setup = () => {
  const utils = render(
    <MockedProvider mocks={[]} addTypename={false}>
      <Dialog open={true}>
        <FormCreateClient />
      </Dialog>
    </MockedProvider>
  )

  const nameField = screen.getByLabelText('Nome')
  const btnSubmit = screen.getByText('Salvar')

  return {
    nameField,
    btnSubmit,
    ...utils
  }
}

it('Verificando renderização do component de formulário de criação de cliente', () => {
  const { container } = setup()

  expect(container).toMatchSnapshot()
})

it('Verificando se todos os campos são obrigatórios, apresentando o border-red-700 no attributo class', async () => {
  const { btnSubmit } = setup()

  fireEvent.submit(btnSubmit)

  expect((await screen.findAllByRole("textbox")).filter(field => field.className.includes("border-red-700"))).toHaveLength(5)
})