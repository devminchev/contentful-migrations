import { writeFile } from 'fs';
// change baseUrl based on environment
const baseUrl = "https://sports-graphql-gateway.eks00.prod.na00.aws.ballys.tech/graphql";

const query = `
query fixtures($filter: FixturesQueryFixtureFilter, $first: Int) {
    fixtures(filter: $filter, first: $first) {
        pageInfo {
            hasNextPage
        }
        edges {
            node {
                ... on SimpleFixture {
                    participants {
                        path
                        participantKey
                        participantType
                        name
                    }
                }
            }
        }
    }
}
`;
// competitions with a Sports Participant in Contentful
// its better to query by competition because some teams might have the same name for eg: basketball/american_football
const competitions = [
    'football/england/premier_league',
    'football/italy/serie_a',
    'football/usa/mls',
    'football/germany/bundesliga',
    'football/spain/la_liga',
    'ice_hockey/nhl',
    'american_football/nfl',
    'american_football/ncaaf',
    'basketball/ncaab',
    'baseball/mlb',
    'basketball/nba',
    'basketball/wnba'
]

async function sportsGraphQL(variables) {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Tenant': 'us-oh'
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

function extractTeams(data, competition) {
    const teams = new Set();
    if (data && data.data && data.data.fixtures) {
        if (data.data.fixtures.pageInfo.hasNextPage) console.warn('has next page')
        data.data.fixtures.edges.forEach(edge => {
            edge.node.participants.forEach(participant => {
                if (participant.participantType === 'TEAM') {
                    teams.add(JSON.stringify({
                        competition,
                        path: participant.path,
                        participantKey: participant.participantKey,
                        name:participant.name
                    }));
                }
            });
        });
    }
    return Array.from(teams).map(team => JSON.parse(team));
}

async function getAllTeams() {
    let allTeams = new Set();

    for (const competition of competitions) {
        let variables = {
            first: 1000,
            filter: {  
                groups: {
                    path: competition
                }
            }
        };
        try {
            const data = await sportsGraphQL(variables);
            const newTeams = extractTeams(data,competition);
            newTeams.forEach(team => allTeams.add(JSON.stringify(team)));
        } catch (error) {
            console.error(`Error fetching data for ${competition}:`, error);
        }
    }

    return Array.from(allTeams).map(team => JSON.parse(team))
}
// writing as csv only because its easier to read using excel and share if needed
getAllTeams().then(teams => {
    const csvContent = teams.map(team => `${team.name},${team.path},${team.participantKey},${team.competition}`).join('\n');
    const header = 'name,path,key,competition\n';
    
    writeFile('teams.csv', header + csvContent, (err) => {
        if (err) {
            console.error('Error writing to CSV file:', err);
        } else {
            console.log(`CSV file 'teams.csv' has been saved with ${teams.length} teams.`);
        }
    });
}).catch(error => {
    console.error('Error:', error);
});
