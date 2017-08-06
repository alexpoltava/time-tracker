import duration from './duration';

import 'babel-polyfill';

import { expect } from 'chai';

describe('duration', () => {
  for(let i = 1551537000; i < 1551537061; i++) {
    it(`should return a valid string for integer seconds number ${i % 60}`, () => {
        expect(Number(duration(i).slice(-2))).to.be.equal(i % 60);
    });
  }
});
