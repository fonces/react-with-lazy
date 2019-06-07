# react-with-lazy
Package to easily launch react hooks' suspense with Promise.  
Cache results in Promsie definition units.  
The result is done at the same time as the destruction of the component. Also, it is possible to cache permanently.  

## Usage
```jsx
import withLazy, { LazyComponentProps } from 'react-with-lazy'

const Employees = ({ useLazy }: LazyComponentProps) => {
  const { state: { page, rowsPerPage } } = useContext(PaginationContext)
  const employees = useLazy<Employee[]>(
    () => api.get('employees', { page, rowsPerPage }).then(res => res.json()),
    [page, rowsPerPage]
  )

  return (
    <>
      {employees.map((employee, key) => (
        <ul key={key}>
          <li>{employee.id}</li>
          <li>{employee.employee_name}</li>
          <li>{employee.employee_salary}</li>
          <li>{employee.employee_age}</li>
          <li>{employee.profile_image}</li>
        </ul>
      ))}
    </>
  )
}

const LazyEmployees = withLazy(Employees)

export default () => (
  <React.Suspense fallback={<Loading />}>
    <LazyEmployees />
  </React.Suspense>
)
```

or

```jsx
import { createUseLazy, LazyComponentProps } from 'react-with-lazy'

// Cache forever
const useLazy = createUseLazy({
  perpetual: true
})

const Employee = ({ id }: Props) => {
  const employee = useLazy<Employee>(
    () => api.get('employee', { id }).then(res => res.json()),
    [id]
  )

  return (
    <ul>
      <li>{employee.id}</li>
      <li>{employee.employee_name}</li>
      <li>{employee.employee_salary}</li>
      <li>{employee.employee_age}</li>
      <li>{employee.profile_image}</li>
    </ul>
  )
}

export default () => (
  <React.Suspense fallback={<Loading />}>
    <Employee />
  </React.Suspense>
)
```

## API
useLazy can specify a promise and an array as an argument
```js
useLazy<T = any, I = any>(
  promise: Promise<T> | (() => Promise<T>),
  inits?: I
): T
```

withLazy can be used by specifying Component
```js
withLazy<P extends LazyComponentProps>(
  Component: ComponentType<P>,
  options?: CreateUseLazyOptions
): ReactElement
```

## interfaces
CreateUseLazyOptions
```
{
  perpetual?: boolean
}
```

## Other
When making it, I made reference to [this](https://github.com/CharlesStover/fetch-suspense) source.  
Thank you.
