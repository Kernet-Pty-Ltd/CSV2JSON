import fs from 'npm:fs-extra';
import csv from 'npm:csv-parser';
import uniqid from 'npm:uniqid';



let id = 0;
const results: IHireCandidate[] = [];

// Function to read CSV and convert to JSON
function readCsvToJson(csvFilePath: string, jsonFilePath: string) {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      if (data.Name !== undefined && data.Name !== "") {

        let phones = [];
        let qualifications = [];
        let languages = [];
        let skills = [];
        let work: IWork[] = [];
        let profiles: IProfilePages[] = [];

        if (data.Phone !== undefined && data.Phone !== "") {
          phones = data.Phone.split('##').map((item: string) => item.trim())
        }

        if (data.Skills !== undefined && data.Skills !== "") {
          skills = data.Skills.split('##').map((item: string) => item.trim());
        }

        if (data.Languages !== undefined && data.Languages !== "") {
          languages = data.Languages.split('##').map((item: string) => item.trim())
        }

        const cr24 = data['Career Profile Link'];
        const linkedIn = data['Linkedin Profile link'];

        if (cr24 !== undefined && cr24 !== "") {
          profiles.push({
            name: 'Career24',
            link: cr24
          })
        }

        if (data.Qualifications !== undefined && data.Qualifications !== "") {
          qualifications = data.Qualifications.split('##')
        }

        if (linkedIn !== undefined && linkedIn !== "") {

          profiles.push({
            name: 'LinkedIn',
            link: linkedIn
          })
        }

        const currentWork = data['Working History 1 (Current)'];

        if (currentWork !== undefined && currentWork !== "") {

          const w = currentWork.split("##").map((item: string) => item.trim());;

          work.push({
            position: w[0]?.trim(),
            company: w[1]?.trim(),
            date: w[2]?.trim(),
            period: w[3]?.trim(),
            other: w[4]?.trim(),
          })
        }

        const prevWork = data['Working History 2 (Previous)'];

        if (prevWork !== undefined && prevWork !== "") {

          const w = prevWork.split("##").map((item: string) => item.trim());

          work.push({
            position: w[0]?.trim(),
            company: w[1]?.trim(),
            date: w[2]?.trim(),
            period: w[3]?.trim(),
            other: w[4]?.trim(),
          })
        }

        const otherWork = data['Working History 3 (Previous, Previous)'];

        if (otherWork !== undefined && otherWork !== "") {

          const w = otherWork.split("##").map((item: string) => item.trim());

          work.push({
            position: w[0]?.trim(),
            company: w[1]?.trim(),
            date: w[2]?.trim(),
            period: w[3]?.trim(),
            other: w[4]?.trim(),
          })
        }

        const candidate: IHireCandidate = {
          id: uniqid(),
          name: data.Name,
          occupation: data.Occupation || undefined,
          location: data.Location || undefined,
          nationality: data.Nationality || undefined,
          gender: data.Gender || undefined,
          phones,
          languages,
          work,
          skills,
          emails: data.Email !== undefined ? [data.Email] : [],
          experience: data.Experience || undefined,
          cover: data.Cover || undefined,
          profiles,
          salary: data.Salary || undefined,
          ethnicity: data.Ethnicity || undefined,
          verification: {
            verified: data.Verification === "Not Verrified",
            comment: data.Comment || undefined,
            by: data['Verified by'] || undefined,
            date: data['Verified date'] || undefined,
          },
          qualifications,

        };
        results.push(candidate);
      }
    })
    .on('end', () => {
      // Save the results array to a JSON file
      fs.writeFile(jsonFilePath, JSON.stringify(results, null, 2), (err) => {
        if (err) {
          console.error('Error writing JSON file:', err);
        } else {
          console.log('JSON file successfully written!');
        }
      });
    });
}
//
readCsvToJson('java.csv', 'java.json');

export interface IHireCandidate {
  id?: string;
  name: string;
  occupation?: string;
  phones?: string[];
  emails?: string[];
  profiles?: IProfilePages[];
  location?: string;
  qualifications?: string[];
  skills?: string[];
  verification?: IVerification;
  experience: number;
  dob?: string;
  salary?: string; // Expactation
  workType?: 'Remote' | 'Office' | 'both';
  gender?: 'Male' | 'Female';
  work?: IWork[];
  ethnicity?: string;
  nationality?: string;
  languages?: string[];
  cover?: string;
}

export interface IWork {
  position?: string | undefined;
  location?: string;
  company?: string;
  period?: string;
  date?: string;
  other?: string;
}
export interface IProfilePages {
  name: string;
  link: string;
}

export interface IVerification {
  by?: string;
  verified: boolean;
  date?: string;
  comment?: string;
}
