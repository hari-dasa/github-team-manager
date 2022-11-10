export class GithubClient {
    // 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
    public api;
    public orgName;
    public token;

    constructor(token, name)
    {
        this.api = "https://api.github.com/orgs";
        this.token = token;

        this.orgName = name;
    }

    async listTeamsByOrganization()
    {
        const result = await fetch(`${this.api}/${this.orgName}/teams`, {
            method: 'GET',
             headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
             }
         })
        console.log("teams :")
        console.log(result)
        return result.json() 
    }

    async addCollaborator(username, role, slug)
    {
        const payload = {
            'role': role
        }

        const result = await fetch(`${this.api}/${this.orgName}/teams/${slug}/memberships/${username}`, {
            method: 'PUT',
             headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
             },
             body: JSON.stringify(payload)
         });

         return result
    }

    async removeCollaborator(username, slug)
    {

        const result = await fetch(`${this.api}/${this.orgName}/teams/${slug}/memberships/${username}`, {
            method: 'DELETE',
             headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json'
             }
         });
         console.log(result)
         return result
    }
}