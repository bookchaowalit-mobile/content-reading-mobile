import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from '../src/screens/DashboardScreen';
import type {Goal, Venture} from '../src/lib/business';

// Amounts stay below 1,000 so toLocaleString() output does not depend on the
// test machine's locale (no thousands separator).
const ventures: Venture[] = [
  {
    id: 'a',
    name: 'Shop',
    category: 'E-commerce',
    status: 'active',
    revenue: 500,
    expenses: 200,
  },
  {
    id: 'b',
    name: 'Blog',
    category: 'Content',
    status: 'paused',
    revenue: 300,
    expenses: 0,
  },
  {
    id: 'c',
    name: 'Course',
    category: 'Content',
    status: 'planning',
    revenue: 0,
    expenses: 100,
  },
];

const goal = (id: string, title: string, current: number): Goal => ({
  id,
  title,
  target: 1000,
  current,
  deadline: '',
});

async function renderDashboard() {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<DashboardScreen />);
  });
  return tree;
}

// Join each <Text>'s children so "฿{n}" renders as one string.
const texts = (tree: ReactTestRenderer.ReactTestRenderer) =>
  tree.root
    .findAllByType(Text)
    .map(node => [node.props.children].flat().join(''));

beforeEach(async () => {
  await AsyncStorage.clear();
});

it('shows empty states when nothing is stored', async () => {
  const shown = texts(await renderDashboard());
  expect(shown).toContain('No goals yet');
  expect(shown).toContain('No ventures yet');
  expect(shown).toContain('฿0');
  // No revenue means no margin line (not "NaN% margin").
  expect(shown.some(t => t.includes('margin'))).toBe(false);
});

it('summarises stored ventures and goals', async () => {
  await AsyncStorage.setItem('ventures', JSON.stringify(ventures));
  await AsyncStorage.setItem(
    'goals',
    JSON.stringify([
      goal('g1', 'Emergency fund', 996),
      goal('g2', 'Laptop', 250),
      goal('g3', 'Trip', 0),
      goal('g4', 'Fourth goal', 10),
    ]),
  );

  const shown = texts(await renderDashboard());

  // revenue 800, expenses 300, profit 500 -> 63% margin, one active venture.
  expect(shown).toEqual(
    expect.arrayContaining(['฿800', '฿300', '฿500', '63% margin', '1']),
  );

  // Only the first three goals; 99.6% must not be shown as 100%.
  expect(shown).toEqual(
    expect.arrayContaining([
      'Emergency fund',
      '99%',
      'Laptop',
      '25%',
      'Trip',
      '0%',
    ]),
  );
  expect(shown).not.toContain('Fourth goal');

  // Top ventures by profit; Blog and Shop tie at 300, so name order decides.
  const names = shown.filter(t => ['Shop', 'Blog', 'Course'].includes(t));
  expect(names).toEqual(['Blog', 'Shop', 'Course']);
});
