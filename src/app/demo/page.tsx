import React from "react";
import { getNarrativeTypes } from "../actions/narrativeTypeActions";
import { getNarratives as getSafetyNarratives } from "../actions/safetyActions";
import { getNarratives } from "../actions/narrativeActions";

export default async function AdminPage() {
  const safetyNarratives = await getSafetyNarratives();
  const narratives = await getNarratives();

  return (
    <div className="flex h-full w-full flex justify-center mt-20">
      <iframe
        title="HaskellSilaCumulative"
        width="1200"
        height="673.5"
        src="https://app.powerbi.com/view?r=eyJrIjoiZWU2NzE0YjgtMDg0Yi00YThjLTlmYWItYjNjMmU2ZTRkNTUzIiwidCI6ImYyODhkNTU2LTJmZTctNDkwZS1iYzdlLTFhMzcwYTRlNTU2ZiIsImMiOjZ9"
        allowFullScreen={true}
      ></iframe>
      {/* <iframe
          title="HaskellSilaCumulative"
          width="1024"
          height="1060"
          src="https://app.powerbi.com/view?r=eyJrIjoiZWU2NzE0YjgtMDg0Yi00YThjLTlmYWItYjNjMmU2ZTRkNTUzIiwidCI6ImYyODhkNTU2LTJmZTctNDkwZS1iYzdlLTFhMzcwYTRlNTU2ZiIsImMiOjZ9"
          frameborder="0"
          allowFullScreen="true"
        ></iframe> */}
    </div>
  );
}
