import "@testing-library/jest-dom";
import { CreateClient } from '@/components/resources/client/create'
import { MockedProvider } from "@apollo/client/testing";
import { render } from '@testing-library/react'


it('renders form unchanged', () => {
  const { container } = render(
    <MockedProvider mocks={[]} addTypename={false}>
      <CreateClient />
    </MockedProvider>

  )
  expect(container).toMatchSnapshot()
})