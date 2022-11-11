import React, {useEffect} from "react";
import { useSettingsButton, useGlobalConfig, Icon, Input } from "@airtable/blocks/ui";
import { useState } from "react";
import Settings from "./Settings";
import { CupStraw, PersonWorkspace } from "react-bootstrap-icons";
import Header from "./Header";
import './App.scss';
import useCustomColors from "./useCustomColors";
import { GithubClient } from "./GithubClient";
import { Alert, Button, Card, ListGroup } from "react-bootstrap";
import SettingsWarning from "./SettingsWarning";

const App = () => {
    const [configSetted, setConfigSetted] = useState(false);
    const [collaborator, setCollaborator] = useState('');
    const [collaboratorRole, setCollaboratorRole] = useState('');
    const [teamSlug, setTeamSlug] = useState('');
    const [teams, setTeams] = useState([]);    
    const [successAction, setSuccessAction] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [iconAlert, setIconAlert] = useState('');
    const [variantAlert, setVariantAlert] = useState('');
    const [action, setAction] = useState('');

    const [githubClient, setGithubClient] = useState(new GithubClient('', ''));
    const globalConfig = useGlobalConfig();

    useEffect(() => {
        getConfig()
    });

    const getConfig = ( ) => {
        const token =  globalConfig.get('ghPersonalToken') as string
        const name  =  globalConfig.get('organizationName') as string

        if(token && name){
            setConfigSetted(true);
            githubClient.orgName = name;
            githubClient.token   = token;
        }
    }

    const [isShowingSettings, setIsShowingSettings] = useState(false);
    useSettingsButton(function () {
        setIsShowingSettings(!isShowingSettings);
        if(teams.length == 0)
            listTeam()
        
        getConfig()
        reset()
    });

     const listTeam = async () => {
        const result = await githubClient.listTeamsByOrganization()
        if(result.status == 401){
            reset()
            flashAlert("Error loading the teams with the given credentials! ", "warning")
        }
        if(result.status == 200){
            setTeams(await result.json())
        }
    }

    const icons = <div className="icons"><PersonWorkspace color="#5577AA" /><CupStraw color="#55AA77" /></div>;

    const backgroundColor = globalConfig.get('backgroundColor') as string;
    const headerColor = globalConfig.get('headerColor') as string;
    useCustomColors({backgroundColor, headerColor});

    const selectTeam = (team) => {
        setTeamSlug(team.slug)
    }

    const addCollaborator = async () => {

        try{
            const result = await githubClient.addCollaborator(collaborator, collaboratorRole, teamSlug)

            if (result.status == 200){
                reset()
                flashAlert("Collaborator added with success", "success")
            } else {
                reset()
                flashAlert("Error to add a new collaborator! ", "warning")
            }
        }catch(e){
            reset()
            flashAlert("Unexpected error to remove collaborator", "warning")
            console.log(e)
        }
    }

    const reset = () => {
        setTeamSlug('')
        setCollaborator('')
        setAction('')
        
    }

    const removeCollaborator = async () => {
        try{
            const result = await githubClient.removeCollaborator(collaborator, teamSlug)

            if (result.status == 204){
                reset()
                flashAlert("Collaborator removed with success", "success")
            } else {
                flashAlert("Error to remove collaborator", "warning")
            }
        }catch(e){
            reset()
            flashAlert("Unexpected error to remove collaborator", "warning")
            console.log(e)
        }

    }

    const isButtonDisabled = () => {
        return collaborator == '' ? true : false
    }

    const getActions = () => {
        switch(action){
            case 'add':
                return (
                    <Card>
                        <Card.Header>Add or update a collaborator</Card.Header>
                        <Card.Body style={{justifyContent: "space-between"}}>

                            <Input 
                                value={collaborator}
                                onChange={e => setCollaborator(e.target.value)}
                                placeholder="Collaborator username "
                                width="320px"
                            />

                            <ListGroup style={{justifyContent: 'center',marginTop: 20, marginBottom: 15, marginLeft: 3, width: '60%', height: '20%'}}>
                                <ListGroup.Item action onClick={() => setCollaboratorRole('maintainer')}>
                                    Maintainer
                                </ListGroup.Item>
                                <ListGroup.Item action onClick={() => setCollaboratorRole('member')}>
                                    Member
                                </ListGroup.Item>
                            </ListGroup>
                            <Button onClick={() => addCollaborator()} disabled={ isButtonDisabled() }>
                                Add Collaborator
                            </Button>
                        </Card.Body>
                    </Card>
                )
            case 'remove':
                return (
                    <Card>
                        <Card.Header>Remove a collaborator</Card.Header>
                        <Card.Body style={{justifyContent: "space-between"}}>

                            <Input 
                                value={collaborator}
                                onChange={e => setCollaborator(e.target.value)}
                                placeholder="Collaborator username "
                                width="320px"
                                style={{marginBottom: 15, marginLeft: 3}}
                            />

                            <Button onClick={() => removeCollaborator()} disabled={ isButtonDisabled() }>
                                Remove Collaborator
                            </Button>
                        </Card.Body>
                    </Card>
                )
            default:
                return (
                    <Card>
                        <Card.Header>Select the action to do with the team</Card.Header>
                        <Card.Body>
                            <ListGroup horizontal="lg">
                                <ListGroup.Item action onClick={() => setAction('add')}>
                                            Add
                                </ListGroup.Item>

                                <ListGroup.Item action onClick={() => setAction('remove')}>
                                            Remove
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                )

        }
    }


    const flashAlert = (message, type) => {
        if(type == "success"){
            setAlertMessage(message) 
            setIconAlert('check')
            setVariantAlert(type)
        }

        if(type =="warning"){
            setAlertMessage(message)
            setIconAlert(type)
            setVariantAlert(type)
        }

        setSuccessAction(!successAction);

        setTimeout(() => {
                setSuccessAction(false);
            }, 3000);
    }

    return (
        <div className="container">
            {isShowingSettings ? <Settings /> : <>
                <Header title="InAir Studio Organizations Teams Manager!" icon={icons} />
                <p>Add or remove collaborators!</p>

                {successAction ?
                        <Alert variant={variantAlert} >
                            <Icon name={iconAlert}/> {alertMessage}
                        </Alert>
                    :
                        <></>
                }

                {configSetted  ?
                        <>
                            {
                            teamSlug == '' ?
                                <Card>
                                    <Card.Header>Select the team to continue</Card.Header>
                                    <Card.Body>
                                        <ListGroup >
                                            {
                                                
                                                teams.length > 0 ?
                                                        teams.map((value) => {
                                                            return (
                                                            <ListGroup.Item action onClick={() => selectTeam(value)}>
                                                                {value.name}
                                                            </ListGroup.Item>)
                                                        })
                                                    :
                                                        <Button onClick={() => listTeam()}>
                                                            Load Teams
                                                        </Button>
                                            }

                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            :
                                <>
                                    {
                                        getActions()
                                    }
                                    
                                </>
                            }
                        </>
                    :
                        <SettingsWarning/>
                }
            </>}
        </div>
    );
}

export default App;