import useApi from '../Api/useApi'
import Table from './Table'

const getMembers = (data) =>
  data.members.map((member) => [
    member.person.fullName,
    member?.affiliation?.name,
  ])
const getTechniques = (data) =>
  data.datasets.flatMap((dataset) =>
    dataset.techniques.map((technique) => [technique.name]),
  )
const getParameters = (data) =>
  data.datasets.flatMap((dataset) =>
    dataset.parameters.map((param) => [
      param.name,
      param.unit ? `${param.value} ${param.unit}` : param.value,
    ]),
  )

function Section({ pid, include, fn, title, open }) {
  const { data } = useApi(`/documents/${encodeURIComponent(pid)}`, [], {
    include,
    limit: 0,
  })
  const tableData = fn(data)
  const isEmpty = tableData.length === 0
  return isEmpty || <Table title={title} data={tableData} open={open} />
}

export function Members({ pid }) {
  const include = ['affiliation', 'person']
  return (
    <Section open include={include} title="Members" fn={getMembers} pid={pid} />
  )
}

export function Techniques({ pid }) {
  const include = ['techniques']
  return (
    <Section
      include={include}
      title="Techniques"
      fn={getTechniques}
      pid={pid}
    />
  )
}

export function Parameters({ pid }) {
  const include = ['parameters']
  return (
    <Section
      include={include}
      title="Parameters"
      fn={getParameters}
      pid={pid}
    />
  )
}