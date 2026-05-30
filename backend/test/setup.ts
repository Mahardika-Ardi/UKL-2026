import * as dotenv from 'dotenv';
import * as path from 'path';

export default function globalSetup() {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}
