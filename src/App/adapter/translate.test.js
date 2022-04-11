import { template } from '../../filters'
import { LABEL_FOR_CONFIG } from './lib/state'
import applyTemplate from './translate'

const translate = applyTemplate(template)

const id = LABEL_FOR_CONFIG

test('no filter and default config', () => {
  const query = translate([])
  expect(query).toEqual({ limit: 5 })
})

test('no pagination', () => {
  const query = translate([{ id, pageSize: false }])
  expect(query).toEqual({})
})

test('custom pagination', () => {
  const query = translate([{ id, pageSize: 10, page: 2 }])
  expect(query).toEqual({ limit: 10, skip: 10 })
})

test('custom ordering', () => {
  const query = translate(
    [
      {
        id,
        order: ['foo ASC', 'bar DESC'],
      },
    ],
    template,
  )

  expect(query).toEqual({ order: ['foo ASC', 'bar DESC'], limit: 5 })
})

test('single root filter and custom include', () => {
  const query = translate([
    { id, include: ['datasets', 'affiliation', 'person'] },
    {
      id: 'type',
      value: 'proposal',
    },
  ])

  expect(query).toEqual({
    include: [
      {
        relation: 'members',
        scope: {
          include: [{ relation: 'affiliation' }, { relation: 'person' }],
        },
      },
      { relation: 'datasets' },
    ],
    where: { type: 'proposal' },
    limit: 5,
  })
})

test('multiple filters and custom include', () => {
  const query = translate([
    { id, include: ['datasets', 'affiliation', 'person'] },
    {
      id: 'type',
      value: 'experiment',
    },
    {
      id: 'sample_temperature',
      value: ['0', '7300'],
      operator: 'between',
      unit: 'K',
    },
  ])

  expect(query).toEqual({
    include: [
      {
        relation: 'members',
        scope: {
          include: [{ relation: 'affiliation' }, { relation: 'person' }],
        },
      },
      {
        relation: 'datasets',
        scope: {
          include: [
            {
              relation: 'parameters',
              scope: {
                where: {
                  and: [
                    { name: 'sample_temperature' },
                    { value: { between: ['0', '7300'] } },
                    { unit: 'K' },
                  ],
                },
              },
            },
          ],
        },
      },
    ],
    where: { type: 'experiment' },
    limit: 5,
  })
})