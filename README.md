# react-with-lazy
Package to easily launch react hooks' suspense with Promise

## Usage
```js
const Employees = ({ useLazy }: Props) => {
  const employees = useLazy<Employee[]>(
    () => api.get('employees', { page, rowsPerPage }).then(res => res.json())
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
  Component: ComponentType<Omit<P, keyof LazyComponentProps>>
): ReactElement
```
