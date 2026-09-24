import fs from 'fs';

const transcriptPath = 'C:/Users/raptor/.gemini/antigravity-ide/brain/152607db-d838-46fb-b9be-6a58888d3b5c/.system_generated/logs/transcript.jsonl';
const fileContent = fs.readFileSync(transcriptPath, 'utf8');
const lines = fileContent.split('\n');
for (const l of lines) {
  if (l.includes('"step_index":59')) {
    const parsed = JSON.parse(l);
    console.log(parsed.content);
    break;
  }
}
