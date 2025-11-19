import contentful from 'contentful-management';

import defaultTranslations from './localisations/default-translations.js';
import newJerseyTranslations from './localisations/new-jersey-translations.js';
import spanishTranslations from './localisations/spanish-translations.js';

import heartbingoTranslations from './localisations/heartbingo/translations.js';
import jackpotjoyTranslations from './localisations/jackpotjoy/translations.js';
import monopolycasinoTranslations from './localisations/monopolycasino/translations.js';
import rainbowrichescasinoTranslations from './localisations/rainbowrichescasino/translations.js';
import tropicanaTranslations from './localisations/tropicana/translations.js';
import virgincasinoTranslations from './localisations/virgincasino/translations.js';
import virgingamesTranslations from './localisations/virgingames/translations.js';

const PUBLISH = false;
const SPACE_ID = 'nw2595tc1jdx';

const getVenture = async (venture, environment) => {
  const ventures = await environment.getEntries({
    content_type: 'venture',
  });

  return ventures.items.find((item) => item.fields.name && item.fields.name['en-GB'] === venture);
};

const createVentureLocalisations = async (localisations, environment, venture) => {
  for (const [key, value] of Object.entries(localisations)) {
    const fields = {
      entryTitle: { 'en-GB': `${key} [${venture.fields.name['en-GB']}]` },
      key: { 'en-GB': `${key}` },
      value,
      venture: { 'en-GB': { sys: { type: 'link', linkType: 'Entry', id: venture.sys.id } } },
    };

    const entry =
      PUBLISH &&
      (await environment.createEntry('localisation', {
        fields,
      }));

    PUBLISH && (await entry.publish());

    console.log('Localisation created: ', venture.fields.name['en-GB'], key);
  }
};

const createDefaultLocalisations = async (localisations, environment) => {
  for (const [key, value] of Object.entries(localisations)) {
    const fields = {
      entryTitle: { 'en-GB': `${key}` },
      key: { 'en-GB': `${key}` },
      value,
    };

    const entry = PUBLISH && (await environment.createEntry('localisation', { fields }));

    PUBLISH && (await entry.publish());

    console.log('Localisation created: ', key);
  }
};

const script = async ({ accessToken, env }) => {
  const commonLocalisations = {};
  const heartbingoLocalisations = {};
  const jackpotjoyLocalisations = {};
  const monopolycasinoLocalisations = {};
  const rainbowrichescasinoLocalisations = {};
  const tropicanaLocalisations = {};
  const virgincasinoLocalisations = {};
  const virgingamesLocalisations = {};

  for (const [key, value] of Object.entries(defaultTranslations)) {
    commonLocalisations[key] = { ...commonLocalisations[key], 'en-GB': value };
  }

  for (const [key, value] of Object.entries(newJerseyTranslations)) {
    commonLocalisations[key] = { ...commonLocalisations[key], 'en-US': value };
  }

  for (const [key, value] of Object.entries(spanishTranslations)) {
    commonLocalisations[key] = { ...commonLocalisations[key], es: value };
  }

  for (const [key, value] of Object.entries(heartbingoTranslations)) {
    heartbingoLocalisations[key] = { ...heartbingoLocalisations[key], 'en-GB': value };
  }

  for (const [key, value] of Object.entries(jackpotjoyTranslations)) {
    jackpotjoyLocalisations[key] = { ...jackpotjoyLocalisations[key], 'en-GB': value };
  }

  for (const [key, value] of Object.entries(monopolycasinoTranslations)) {
    monopolycasinoLocalisations[key] = { ...monopolycasinoLocalisations[key], 'en-GB': value };
  }

  for (const [key, value] of Object.entries(rainbowrichescasinoTranslations)) {
    rainbowrichescasinoLocalisations[key] = { ...rainbowrichescasinoLocalisations[key], 'en-GB': value };
  }

  for (const [key, value] of Object.entries(tropicanaTranslations)) {
    tropicanaLocalisations[key] = { ...tropicanaLocalisations[key], 'en-GB': value };
    tropicanaLocalisations[key] = { ...tropicanaLocalisations[key], 'en-US': value };
  }

  for (const [key, value] of Object.entries(virgincasinoTranslations)) {
    virgincasinoLocalisations[key] = { ...virgincasinoLocalisations[key], 'en-GB': value };
    virgincasinoLocalisations[key] = { ...virgincasinoLocalisations[key], 'en-US': value };
  }

  for (const [key, value] of Object.entries(virgingamesTranslations)) {
    virgingamesLocalisations[key] = { ...virgingamesLocalisations[key], 'en-GB': value };
  }

  try {
    const client = contentful.createClient({
      accessToken,
    });
    const space = await client.getSpace(SPACE_ID);
    const environment = await space.getEnvironment(env);
    const heartbingoLink = await getVenture('heart', environment);
    const jackpotjoyLink = await getVenture('jackpotjoy', environment);
    const monopolycasinoLink = await getVenture('monopolycasino', environment);
    const rainbowrichescasinoLink = await getVenture('rainbowriches', environment);
    // const tropicanaLink = await getVenture('tropicana', environment);
    // const virgincasinoLink = await getVenture('virgincasino', environment);
    const virgingamesLink = await getVenture('virgingames', environment);

    await createDefaultLocalisations(commonLocalisations, environment);

    await createVentureLocalisations(heartbingoLocalisations, environment, heartbingoLink);
    await createVentureLocalisations(jackpotjoyLocalisations, environment, jackpotjoyLink);
    await createVentureLocalisations(monopolycasinoLocalisations, environment, monopolycasinoLink);
    await createVentureLocalisations(rainbowrichescasinoLocalisations, environment, rainbowrichescasinoLink);
    // await createVentureLocalisations(tropicanaLocalisations, environment, tropicanaLink);
    // await createVentureLocalisations(virgincasinoLocalisations, environment, virgincasinoLink);
    await createVentureLocalisations(virgingamesLocalisations, environment, virgingamesLink);
  } catch (error) {
    console.error({ error });
  }
};

export default script;
