# Tension Grid

[Web site](https://tensiongrid.com)

- Click anywhere to start (in prod)
- Where else can we play an sound?
- Follower another color (different from power up)

Event: Player slow effect applied                                         
Rationale: Currently silent when player gets slowed - audio would         
reinforce                                                                 
    the penalty                                                            
────────────────────────────────────────                                  
Event: Player fast effect applied                                         
Rationale: Distinguish speed boost from generic power-up sound            
────────────────────────────────────────                                  
Event: Mirror effect applied                                              
Rationale: Control inversion is confusing - a distinctive sound would     
  signal the state change                                                 
────────────────────────────────────────                                  
Event: Fullscreen toggle                                                  
Rationale: Other settings (audio) have feedback, fullscreen is silent     
Lower Priority                                                            
Event: Bullet despawn/timeout                                             
Rationale: Could add subtle pop when bullets expire off-screen            
────────────────────────────────────────                                  
Event: Game resume/unpause                                                
Rationale: Pause menu open has sound, but unpausing is silent             
────────────────────────────────────────                                  
Event: Player movement                                                    
Rationale: Subtle movement sounds could add polish, but may be annoying at
                                                                          
  high frequency                                                          
The architecture (AudioManager + Constants.audio.sounds) is ready to      
support these additions without changes - you'd just add new sound files  
and call playSound() at the appropriate points. 