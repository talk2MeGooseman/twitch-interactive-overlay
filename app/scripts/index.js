/*
 *  `app` module
 *  ============
 *
 *  Provides the game initialization routine.
 */

//  Import game instance configuration.
import './init';
import * as config from '@/config';
import Phaser from 'phaser';

/**
 *  Create a `Phaser.Game` instance and boot the game.
 */
export function boot() {
  const configObject = { ...config };
  const game = new Phaser.Game(configObject);
  return game;
}

boot();
