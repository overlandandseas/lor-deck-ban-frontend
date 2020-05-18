import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Deck from 'lor-card-ban-frontend/utils/Deck';
import sinon from 'sinon';

module('Integration | Component | ban-selection', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function(assert) {
    this.setProperties({
      yourDecks: decks(
        'CEBACAIBEADACBAGBAMTINJ2AIBACBA2DMCQCAIEA4TSUMQCAIAQCAIUAMAQIAI7GE',
        'CEBACAIACYEACBIOCANB4KBLF4YQEAQBAAPSMBABAUOSALJWAEAQCBJB',
        'CEBACAIBAMBACBJIGABAMAIBA4KBMHREFIDQCBILDURCWMJVHIBAEAIFAE3AGAIBBETSS'
      ),
      opponentDecks: decks(
        'CEBACAIBAMBACBJIGABAMAIBA4KBMHREFIDQCBILDURCWMJVHIBAEAIFAE3AGAIBBETSS',
        'CEBQIAQGCULDUPQEAIAAGBQJBICQCAAJCUOSKKYAAEAQCABJ',
        'CECACAQEBABAEAQBBECACAQCBQTDSBIBAQIBWJZUHAAQEAICEUYQA'
      ),
      submitBans: sinon.stub(),
      bansSubmitted: false,
      opponentBans: null,
      numberOfBans: 1,
      openViewDeckModal: sinon.stub()
    });

    await render(hbs`<BanSelection
        @yourDecks={{this.yourDecks}}
        @opponentDecks={{this.opponentDecks}}
        @submitBans={{fn this.submitBans}}
        @bansSubmitted={{this.bansSubmitted}}
        @opponentBans={{this.opponentBans}}
        @numberOfBans={{this.numberOfBans}}
        @openViewDeckModal={{this.openViewDeckModal}}
      />`);
  });

  test('it displays correctly', async function(assert) {
    assert
      .dom('[data-test-ban-label]')
      .exists({ count: 3 }, 'Ban Label exists 3 times');
    assert
      .dom('[data-test-deck-card-container]')
      .exists({ count: 3 }, '3 Decks are contained');
    assert
      .dom('[data-test-your-decks-container]')
      .exists({ count: 3 }, 'Your deck list is visible');
  });

  test('clicking on a deck opens the deck view modal', async function(assert) {
    await click('[data-test-deck-card-container]');

    assert.ok(
      this.openViewDeckModal.calledWith(
        sinon.match({
          cards: sinon.match.array,
          code:
            'CEBACAIBAMBACBJIGABAMAIBA4KBMHREFIDQCBILDURCWMJVHIBAEAIFAE3AGAIBBETSS'
        }),
        'Deck 0'
      )
    );
  });

  test('clicking on your deckList opens the deck view modal', async function(assert) {
    await click('[data-test-your-decks-container]');

    assert.ok(
      this.openViewDeckModal.calledWith(
        sinon.match({
          cards: sinon.match.array,
          code:
            'CEBACAIBEADACBAGBAMTINJ2AIBACBA2DMCQCAIEA4TSUMQCAIAQCAIUAMAQIAI7GE'
        }),
        'Deck 0'
      )
    );
  });

  test('banning a deck changes state to show which deck is banned', async function(assert) {
    assert.dom('[data-test-ban-label]').hasText('Ban');
    assert.dom('[data-test-submit-button__valid]').doesNotExist();
    assert.dom('[data-test-submit-button__no-valid-bans]').exists();

    await click('[data-test-ban-label]');
    assert.dom('[data-test-ban-label]').hasText('Unban');
    assert.dom('[data-test-submit-button__no-valid-bans]').doesNotExist();
    assert.dom('[data-test-submit-button__valid]').exists();

    await click('[data-test-ban-label]');
    assert.dom('[data-test-ban-label]').hasText('Ban');
    assert.dom('[data-test-submit-button__valid]').doesNotExist();
    assert.dom('[data-test-submit-button__no-valid-bans]').exists();
    assert.dom('[data-test-waiting-on-ban]').doesNotExist();

    await click('[data-test-ban-label]');
    await click('[data-test-submit-button__valid]');
    assert.ok(this.submitBans.calledOnce);
  });

  test('displayes waiting for opponent text when waiting on opponent ban', async function(assert) {
    const deckName = 'Will of Ionia Deck';
    assert.dom('[data-test-waiting-on-ban]').doesNotExist();
    assert.dom('[data-test-oppoent-ban]').doesNotExist();
    this.set('bansSubmitted', true);

    assert.dom('[data-test-waiting-on-ban]').exists();
    assert.dom('[data-test-oppoent-ban]').doesNotExist();

    this.set('opponentBans', deckName);
    assert.dom('[data-test-waiting-on-ban]').doesNotExist();
    assert
      .dom('[data-test-oppoent-ban]')
      .hasText(`Your opponent has banned: ${deckName}`);
  });

  test('clicking multiple bans does not allow you to submit', async function(assert) {
    await click('[data-test-ban-label][for="opponent-deck-0"]');
    assert.dom('[data-test-submit-button__no-valid-bans]').doesNotExist();
    assert.dom('[data-test-submit-button__valid]').exists();

    await click('[data-test-ban-label][for="opponent-deck-1"]');
    assert.dom('[data-test-submit-button__valid]').doesNotExist();
    assert.dom('[data-test-submit-button__no-valid-bans]').exists();

    await click('[data-test-ban-label][for="opponent-deck-0"]');
    assert.dom('[data-test-submit-button__no-valid-bans]').doesNotExist();
    assert.dom('[data-test-submit-button__valid]').exists();

    await click('[data-test-ban-label][for="opponent-deck-2"]');
    assert.dom('[data-test-submit-button__valid]').doesNotExist();
    assert.dom('[data-test-submit-button__no-valid-bans]').exists();

    await click('[data-test-ban-label][for="opponent-deck-1"]');
    assert.dom('[data-test-submit-button__no-valid-bans]').doesNotExist();
    assert.dom('[data-test-submit-button__valid]').exists();
  });
});

function decks(...codes) {
  return codes.map((val, idx) => ({
    name: `Deck ${idx}`,
    deck: new Deck(val)
  }));
}
