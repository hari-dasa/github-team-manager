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
        return result
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
         return result
    }
}