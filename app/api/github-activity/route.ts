import { NextResponse } from "next/server";

export async function GET() {
  try {
    const username = "SachPlayZ";
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return NextResponse.json({ error: "GITHUB_TOKEN is required" }, { status: 500 });
    }

    const query = `
      query($userName:String!) {
        user(login: $userName){
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  level
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { userName: username },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Github API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.data.user.contributionsCollection.contributionCalendar);
  } catch (error) {
    console.error("Github activity error:", error);
    return NextResponse.json({ error: "Failed to fetch github activity" }, { status: 500 });
  }
}
